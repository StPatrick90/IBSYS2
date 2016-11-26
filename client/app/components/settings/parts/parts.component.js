"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by Paddy on 13.11.2016.
 */
var core_1 = require('@angular/core');
var part_1 = require('../../../model/part');
var part_service_1 = require('../../../services/part.service');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var session_service_1 = require('../../../services/session.service');
var PartsComponent = (function () {
    function PartsComponent(partservice, sessionService, window) {
        var _this = this;
        this.partservice = partservice;
        this.sessionService = sessionService;
        this.window = window;
        //TODO Object ID richtig her holen
        this.ObjectID = require('mongojs').ObjectID;
        this.nextWsOptions = Array();
        this.part = new part_1.Part();
        this.ruestZeit = Array();
        this.fertigungsZeit = Array();
        this.checkedAP = Array();
        this.anzahl = Array();
        this.checkedParts = Array();
        this.nextArbeitsplaetze = Array();
        this.procTimeIds = new Array();
        /*if (this.sessionService.getWorkstations() != null || this.sessionService.getWorkstations() != undefined ||
            this.sessionService.getParts() != null || this.sessionService.getParts() != undefined ||
            this.sessionService.getProcessingTimes() != null || this.sessionService.getProcessingTimes() != undefined) {
            this.workstations = this.sessionService.getWorkstations();
            this.parts = this.sessionService.getParts();
            this.processingTimes = this.sessionService.getProcessingTimes();
            this.initLists();
        }*/
        //else {
        this.partservice.getWorkstationsAndPartsAndBearbeitung()
            .subscribe(function (data) {
            _this.workstations = data[0];
            _this.parts = data[1];
            _this.processingTimes = data[2];
        }, function (err) { return console.error(err); }, function () { return _this.initLists(); });
        //}
    }
    PartsComponent.prototype.initLists = function () {
        console.log(this.processingTimes);
        this.initMultiSelects();
        this.initCheckboxes();
    };
    PartsComponent.prototype.initMultiSelects = function () {
        this.typOptions = [
            { id: 1, name: 'P' },
            { id: 2, name: 'E' },
            { id: 3, name: 'K' }
        ];
        this.verwOptions = [
            { id: 1, name: 'K' },
            { id: 2, name: 'D' },
            { id: 3, name: 'H' }
        ];
        for (var _i = 0, _a = this.workstations; _i < _a.length; _i++) {
            var ws = _a[_i];
            this.nextWsOptions.push({ id: ws.nummer, name: ws.nummer.toString() });
        }
        this.typSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: false,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '100px',
        };
        this.verwSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 3,
            closeOnSelect: false,
            showCheckAll: true,
            showUncheckAll: true,
            dynamicTitleMaxItems: 3,
            maxHeight: '300px',
        };
        this.nextWsSettings = {
            pullRight: false,
            enableSearch: true,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: false,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '300px',
        };
        this.multiSelectTexts = {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            defaultTitle: 'Select',
        };
    };
    PartsComponent.prototype.initCheckboxes = function () {
        for (var _i = 0, _a = this.workstations; _i < _a.length; _i++) {
            var ws = _a[_i];
            this.checkedAP[ws.nummer] = false;
        }
        for (var _b = 0, _c = this.parts; _b < _c.length; _b++) {
            var part = _c[_b];
            this.checkedParts[part.nummer] = false;
        }
    };
    PartsComponent.prototype.updateCheckedStatus = function (mode, item) {
        if (mode == 1) {
            this.checkedAP[item.nummer] = !this.checkedAP[item.nummer];
        }
        if (mode == 2) {
            this.checkedParts[item.nummer] = !this.checkedParts[item.nummer];
        }
    };
    PartsComponent.prototype.updatePart = function (event) {
        var _this = this;
        event.preventDefault();
        var bereitsVorhanden = false;
        var verwendung = [];
        var bestandteile = [];
        var typ;
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var pts = _a[_i];
            if (pts.nummer == this.part.nummer && pts._id != this.part._id) {
                bereitsVorhanden = true;
            }
        }
        if (!bereitsVorhanden) {
            if (this.part.typ) {
                typ = this.part.typ[0] == "1" ? "P" : this.part.typ[0] == "2" ? "E" : "K";
            }
            if (this.part.verwendung) {
                for (var _b = 0, _c = this.part.verwendung; _b < _c.length; _b++) {
                    var verw = _c[_b];
                    verwendung.push(verw == "1" ? "K" : verw == "2" ? "D" : "H");
                }
                verwendung = verwendung.sort(function (s1, s2) {
                    if (s1 > s2) {
                        return 1;
                    }
                    if (s1 < s2) {
                        return -1;
                    }
                    return 0;
                });
            }
            else {
                this.modalPartEmpty.open();
                return;
            }
            if (typ == "P" || typ == "E") {
                for (var i = 0; i < this.checkedParts.length - 1; i++) {
                    if (this.checkedParts[i]) {
                        bestandteile.push({
                            _id: this.parts.find(function (part) { return part.nummer == i; })._id,
                            anzahl: this.anzahl[i] ? this.anzahl[i] : 0
                        });
                    }
                }
            }
            if (!this.part._id) {
                var newPart = {
                    nummer: this.part.nummer,
                    bezeichnung: this.part.bezeichnung,
                    verwendung: verwendung,
                    typ: typ,
                    wert: this.part.wert,
                    lagerMenge: this.part.lagerMenge,
                    bestandteile: bestandteile,
                    lieferfrist: this.part.lieferfrist ? this.part.lieferfrist : null,
                    abweichung: this.part.abweichung ? this.part.abweichung : null,
                    diskontmenge: this.part.diskontmenge ? this.part.diskontmenge : null
                };
                this.partservice.addPart(newPart)
                    .subscribe(function (part) {
                    _this.parts.push(part);
                    _this.lastId = part._id;
                }, function (err) { return console.error(err); }, function () {
                    typ != "K" ? _this.addProcessingTime() : _this.resetAll();
                });
            }
            else {
                var _part = {
                    _id: this.part._id,
                    nummer: this.part.nummer,
                    bezeichnung: this.part.bezeichnung,
                    verwendung: verwendung,
                    typ: typ,
                    wert: this.part.wert,
                    lagerMenge: this.part.lagerMenge,
                    bestandteile: bestandteile,
                    lieferfrist: this.part.lieferfrist ? this.part.lieferfrist : null,
                    abweichung: this.part.abweichung ? this.part.abweichung : null,
                    diskontmenge: this.part.diskontmenge ? this.part.diskontmenge : null
                };
                this.partservice.updatePart(_part)
                    .subscribe(function (data) {
                    for (var i = 0; i < _this.parts.length; i++) {
                        if (_this.parts[i]._id == _this.part._id) {
                            _this.parts[i] = _part;
                        }
                    }
                    ;
                    _this.sessionService.setParts(_this.parts);
                    _this.lastId = _part._id;
                }, function (err) { return console.error(err); }, function () {
                    typ != "K" ? _this.addProcessingTime() : _this.resetAll();
                });
            }
        }
        else {
            this.modalPartExists.open();
        }
    };
    PartsComponent.prototype.addProcessingTime = function () {
        var _this = this;
        var bearbeitungsZeiten = [];
        if (this.procTimeIds.length > 0) {
            for (var _i = 0, _a = this.procTimeIds; _i < _a.length; _i++) {
                var procTimeId = _a[_i];
                this.partservice.deleteProcessingTime(procTimeId)
                    .subscribe((function (data) {
                    if (data.n == 1) {
                        for (var i = 0; i < _this.processingTimes.length; i++) {
                            if (_this.processingTimes[i]._id == procTimeId) {
                                _this.processingTimes.splice(i, 1);
                                _this.sessionService.setProcessingTimes(_this.processingTimes);
                            }
                        }
                    }
                }));
            }
        }
        for (var i = 0; i < this.checkedAP.length - 1; i++) {
            if (this.checkedAP[i]) {
                var bearbeitungsZeit = {
                    arbeitsplatz: this.ObjectID(this.workstations.find(function (ws) { return ws.nummer == i; })._id),
                    teil: this.ObjectID(this.lastId),
                    ruestZeit: this.ruestZeit[i] ? this.ruestZeit[i] : 0,
                    fertigungsZeit: this.fertigungsZeit[i] ? this.fertigungsZeit[i] : 0,
                    nextArbeitsplatz: this.workstations.find(function (ws) { return ws.nummer == _this.nextArbeitsplaetze[i]; }) ?
                        this.ObjectID(this.workstations.find(function (ws) { return ws.nummer == _this.nextArbeitsplaetze[i]; })._id)
                        : null
                };
                bearbeitungsZeiten.push(bearbeitungsZeit);
            }
        }
        this.partservice.addProcessingTimes(bearbeitungsZeiten)
            .subscribe(function (ba) {
            _this.processingTimes.push(ba);
            _this.sessionService.setProcessingTimes(_this.processingTimes);
            _this.resetAll();
        }, function (err) { return console.error(err); });
    };
    PartsComponent.prototype.setPart = function (pt) {
        this.resetAll();
        var verwendung = [];
        for (var _i = 0, _a = pt.verwendung; _i < _a.length; _i++) {
            var p = _a[_i];
            verwendung.push(p == "K" ? 1 : p == "D" ? 2 : 3);
        }
        this.part._id = pt._id;
        this.part.nummer = pt.nummer;
        this.part.bezeichnung = pt.bezeichnung;
        this.part.verwendung = verwendung;
        this.part.typ = pt.typ == "P" ? [1] : pt.typ == "E" ? [2] : [3];
        this.part.wert = pt.wert;
        this.part.lagerMenge = pt.lagermenge;
        for (var _b = 0, _c = pt.bestandteile; _b < _c.length; _b++) {
            var chkAp = _c[_b];
            for (var _d = 0, _e = this.parts; _d < _e.length; _d++) {
                var part = _e[_d];
                if (part._id == chkAp._id) {
                    this.checkedParts[part.nummer] = true;
                    this.anzahl[part.nummer] = chkAp.anzahl;
                }
            }
        }
        for (var _f = 0, _g = this.processingTimes; _f < _g.length; _f++) {
            var procTime = _g[_f];
            console.log(procTime);
            if (pt._id == procTime.teil._id) {
                this.checkedAP[procTime.arbeitsplatz.nummer] = true;
                this.ruestZeit[procTime.arbeitsplatz.nummer] = procTime.ruestZeit;
                this.fertigungsZeit[procTime.arbeitsplatz.nummer] = procTime.fertigungsZeit;
                this.nextArbeitsplaetze[procTime.arbeitsplatz.nummer] = procTime.nextArbeitsplatz ? [procTime.nextArbeitsplatz.nummer] : null;
                this.procTimeIds.push(procTime._id);
            }
        }
        window.scrollTo(0, 0);
    };
    PartsComponent.prototype.resetAll = function () {
        this.part = {
            _id: null,
            nummer: null,
            bezeichnung: null,
            verwendung: null,
            typ: null,
            wert: null,
            lagerMenge: null,
            bestandteile: null,
            lieferfrist: null,
            abweichung: null,
            diskontmenge: null,
            summe: null
        };
        this.ruestZeit.length = 0;
        this.fertigungsZeit.length = 0;
        this.checkedAP.length = 0;
        this.anzahl.length = 0;
        this.checkedParts.length = 0;
        this.nextArbeitsplaetze.length = 0;
        this.lastId = null;
        this.procTimeIds.length = 0;
        this.initCheckboxes();
    };
    __decorate([
        core_1.ViewChild('modalBestandteile'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], PartsComponent.prototype, "modalBestandteile", void 0);
    __decorate([
        core_1.ViewChild('modalPartExists'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], PartsComponent.prototype, "modalPartExists", void 0);
    __decorate([
        core_1.ViewChild('modalPartEmpty'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], PartsComponent.prototype, "modalPartEmpty", void 0);
    PartsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'parts',
            templateUrl: 'parts.component.html'
        }), 
        __metadata('design:paramtypes', [part_service_1.PartService, session_service_1.SessionService, Window])
    ], PartsComponent);
    return PartsComponent;
}());
exports.PartsComponent = PartsComponent;
//# sourceMappingURL=parts.component.js.map