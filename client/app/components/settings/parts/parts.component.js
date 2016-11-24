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
    function PartsComponent(partservice, sessionService) {
        var _this = this;
        this.partservice = partservice;
        this.sessionService = sessionService;
        this.nextWsOptions = Array();
        this.listVerfuegbareTeile = Array();
        this.listBestandteile = Array();
        this.part = new part_1.Part();
        this.ruestZeit = Array();
        this.fertigungsZeit = Array();
        this.checkedAP = Array();
        this.anzahl = Array();
        this.checkedParts = Array();
        this.nextArbeitsplaetze = Array();
        if (this.sessionService.getWorkstations() != null || this.sessionService.getWorkstations() != undefined ||
            this.sessionService.getParts() != null || this.sessionService.getParts() != undefined ||
            this.sessionService.getProcessingTimes() != null || this.sessionService.getProcessingTimes() != undefined) {
            this.workstations = this.sessionService.getWorkstations();
            this.parts = this.sessionService.getParts();
            this.processingTimes = this.sessionService.getProcessingTimes();
            this.initLists();
        }
        else {
            this.partservice.getWorkstationsAndPartsAndBearbeitung()
                .subscribe(function (data) {
                _this.workstations = data[0];
                _this.parts = data[1];
                _this.processingTimes = data[2];
            }, function (err) { return console.error(err); }, function () { return _this.initLists(); });
        }
    }
    PartsComponent.prototype.initLists = function () {
        this.fillVerfuegbareTeile();
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
    PartsComponent.prototype.fillVerfuegbareTeile = function () {
        if (this.part._id == null) {
            this.listVerfuegbareTeile = this.parts.slice();
        }
        else {
            for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
                var part = _a[_i];
                if (part._id != this.part._id) {
                    this.listVerfuegbareTeile.push(part);
                }
            }
        }
    };
    PartsComponent.prototype.initCheckboxes = function () {
        for (var _i = 0, _a = this.workstations; _i < _a.length; _i++) {
            var ws = _a[_i];
            this.checkedAP[ws.nummer] = false;
        }
        for (var _b = 0, _c = this.parts; _b < _c.length; _b++) {
            var part = _c[_b];
            this.checkedAP[part.nummer] = false;
        }
    };
    PartsComponent.prototype.updatePart = function (event) {
        var _this = this;
        event.preventDefault();
        var bereitsVorhanden = false;
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var pts = _a[_i];
            if (pts.nummer == this.part.nummer && pts._id != this.part._id) {
                bereitsVorhanden = true;
            }
        }
        if (!bereitsVorhanden) {
            if (!this.part._id) {
                var newPart = {
                    nummer: this.part.nummer,
                    bezeichnung: this.part.bezeichnung,
                };
                if (newPart.nummer != null && newPart.bezeichnung != null) {
                    this.workstationService.addWorkstation(newWorkstation)
                        .subscribe(function (workstation) {
                        _this.workstations.push(workstation);
                        _this.sessionService.setWorkstations(workstations);
                        _this.resetWorkstation();
                    });
                }
                else {
                    this.modalWsEmpty.open();
                }
            }
        }
        /*
        else {
            this.modalWsExists.open();
        }
         */
    };
    PartsComponent.prototype.updateCheckedStatus = function (mode, item) {
        if (mode == 1) {
            this.checkedAP[item.nummer] = !this.checkedAP[item.nummer];
        }
        if (mode == 2) {
            this.checkedParts[item.nummer] = !this.checkedParts[item.nummer];
        }
    };
    PartsComponent.prototype.test = function () {
        var _this = this;
        var verwendung = [];
        var bestandteile = [];
        var typ;
        if (this.part.verwendung) {
            for (var _i = 0, _a = this.part.verwendung; _i < _a.length; _i++) {
                var verw = _a[_i];
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
        for (var i = 0; i < this.checkedParts.length - 1; i++) {
            if (this.checkedParts[i]) {
                bestandteile.push({
                    _id: this.parts.find(function (part) { return part.nummer == i; })._id,
                    anzahl: this.anzahl[i] ? this.anzahl[i] : 0
                });
            }
        }
        if (this.part.typ) {
            typ = this.part.typ[0] == "1" ? "P" : this.part.typ[0] == "2" ? "E" : "K";
        }
        var newPart = {
            nummer: this.part.nummer,
            bezeichnung: this.part.bezeichnung,
            verwendung: verwendung,
            typ: typ,
            wert: this.part.wert,
            lagerMenge: this.part.lagerMenge,
            bestandteile: bestandteile,
            lieferfrist: this.part.lieferfrist,
            abweichung: this.part.abweichung,
            diskontmenge: this.part.diskontmenge
        };
        this.partservice.addPart(newPart)
            .subscribe(function (part) {
            _this.parts.push(part);
            _this.lastId = part._id;
        }, function (err) { return console.error(err); }, function () { return _this.addProcessingTime(); });
    };
    PartsComponent.prototype.addProcessingTime = function () {
        var _this = this;
        var bearbeitungsZeiten = [];
        for (var i = 0; i < this.checkedAP.length - 1; i++) {
            if (this.checkedAP[i]) {
                var bearbeitungsZeit = {
                    arbeitsplatz: 'ObjectId("' + this.workstations.find(function (ws) { return ws.nummer == i; })._id + '")',
                    teil: 'ObjectId("' + this.lastId + '")',
                    ruestZeit: this.ruestZeit[i] ? this.ruestZeit[i] : 0,
                    fertigungsZeit: this.fertigungsZeit[i] ? this.fertigungsZeit[i] : 0,
                    nextArbeitsplatz: this.workstations.find(function (ws) { return ws.nummer == _this.nextArbeitsplaetze[i]; }) ?
                        'ObjectId("' + this.workstations.find(function (ws) { return ws.nummer == _this.nextArbeitsplaetze[i]; })._id + '")'
                        : null
                };
                bearbeitungsZeiten.push(bearbeitungsZeit);
            }
        }
        this.partservice.addProcessingTimes(bearbeitungsZeiten)
            .subscribe(function (ba) {
            console.log(ba);
        }, function (err) { return console.error(err); });
    };
    __decorate([
        core_1.ViewChild('modalBestandteile'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], PartsComponent.prototype, "modalBestandteile", void 0);
    PartsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'parts',
            templateUrl: 'parts.component.html'
        }), 
        __metadata('design:paramtypes', [part_service_1.PartService, session_service_1.SessionService])
    ], PartsComponent);
    return PartsComponent;
}());
exports.PartsComponent = PartsComponent;
//# sourceMappingURL=parts.component.js.map