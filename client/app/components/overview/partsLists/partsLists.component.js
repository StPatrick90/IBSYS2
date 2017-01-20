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
 * Created by Paddy on 07.12.2016.
 */
var core_1 = require('@angular/core');
var session_service_1 = require('../../../services/session.service');
var part_1 = require('../../../model/part');
var part_service_1 = require('../../../services/part.service');
var translate_pipe_1 = require('../../../translate/translate.pipe');
var PartsListsComponent = (function () {
    function PartsListsComponent(partservice, sessionService, translatePipe) {
        var _this = this;
        this.partservice = partservice;
        this.sessionService = sessionService;
        this.translatePipe = translatePipe;
        this.part = new part_1.Part();
        this.partsList = Object();
        this.columns = 0;
        this.rows = 0;
        this.zeilen = Array();
        this.column = 1;
        this.uebersicht = Array();
        this.productOptions = Array();
        this.getNumber = function (num) {
            var array = Array();
            for (var i = 1; i <= num; i++) {
                array.push(i);
            }
            return array;
        };
        if (this.sessionService.getParts() != null || this.sessionService.getParts() != undefined) {
            this.parts = this.sessionService.getParts();
            this.pparts = this.sessionService.getParts().filter(function (item) { return item.typ == "P"; });
            this.initMultiSelects();
        }
        else {
            this.partservice.getParts()
                .subscribe(function (parts) {
                _this.parts = parts;
                _this.pparts = parts.filter(function (item) { return item.typ == "P"; });
            }, function (err) { return console.error(err); }, function () { return _this.initMultiSelects(); });
        }
    }
    PartsListsComponent.prototype.initMultiSelects = function () {
        for (var _i = 0, _a = this.pparts; _i < _a.length; _i++) {
            var pt = _a[_i];
            this.productOptions.push({ id: pt.nummer, name: this.translatePipe.transform(pt.bezeichnung.toString(), null) });
        }
        this.productSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: true,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '100px',
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
    PartsListsComponent.prototype.generatePartsList = function () {
        if (this.auswahl != undefined && this.auswahl.length == 1) {
            for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
                var pt = _a[_i];
                if (pt.nummer == this.auswahl[0]) {
                    this.part = pt;
                }
            }
            var bestandteile = Array();
            if (this.part != null) {
                this.partsList = {
                    _id: this.part._id,
                    bezeichnung: this.part.bezeichnung,
                    typ: this.part.typ,
                    nummer: this.part.nummer,
                    anzahl: 1,
                    bestandteile: []
                };
                for (var _b = 0, _c = this.part.bestandteile; _b < _c.length; _b++) {
                    var best = _c[_b];
                    for (var _d = 0, _e = this.parts; _d < _e.length; _d++) {
                        var pt = _e[_d];
                        if (best._id == pt._id) {
                            this.rows++;
                            bestandteile.push({
                                _id: pt._id,
                                bezeichnung: pt.bezeichnung,
                                typ: pt.typ,
                                nummer: pt.nummer,
                                anzahl: best.anzahl,
                                bestandteile: this.getBestandteile(pt)
                            });
                        }
                    }
                }
                this.partsList.bestandteile = bestandteile.sort(function (a, b) {
                    var typA = a.typ.toUpperCase();
                    var typB = b.typ.toUpperCase();
                    if (typA > typB) {
                        return -1;
                    }
                    if (typA < typB) {
                        return 1;
                    }
                    if (typA == typB && a.nummer < b.nummer) {
                        return -1;
                    }
                    if (typA == typB && a.nummer > b.nummer) {
                        return 1;
                    }
                    return 0;
                });
            }
        }
        this.generateRows();
        this.generateUebersicht();
    };
    PartsListsComponent.prototype.getBestandteile = function (part) {
        var bestandteile = Array();
        for (var _i = 0, _a = part.bestandteile; _i < _a.length; _i++) {
            var ptOut = _a[_i];
            for (var _b = 0, _c = this.parts; _b < _c.length; _b++) {
                var ptIn = _c[_b];
                if (ptOut._id == ptIn._id) {
                    this.rows++;
                    bestandteile.push({
                        _id: ptIn._id,
                        bezeichnung: ptIn.bezeichnung,
                        typ: ptIn.typ,
                        nummer: ptIn.nummer,
                        anzahl: ptOut.anzahl,
                        bestandteile: this.getBestandteile(ptIn)
                    });
                }
            }
        }
        return bestandteile.sort(function (a, b) {
            var typA = a.typ.toUpperCase();
            var typB = b.typ.toUpperCase();
            if (typA > typB) {
                return -1;
            }
            if (typA < typB) {
                return 1;
            }
            if (typA == typB && a.nummer < b.nummer) {
                return -1;
            }
            if (typA == typB && a.nummer > b.nummer) {
                return 1;
            }
            return 0;
        });
    };
    PartsListsComponent.prototype.generateRows = function () {
        this.columns = 0;
        this.column = 1;
        if (this.zeilen) {
            while (this.zeilen.length > 0) {
                this.zeilen.pop();
            }
        }
        for (var _i = 0, _a = this.partsList.bestandteile; _i < _a.length; _i++) {
            var best = _a[_i];
            this.zeilen.push({ teil: best.typ + best.nummer, anzahl: best.anzahl, column: this.column });
            if (best.bestandteile && best.bestandteile.length > 0) {
                this.columns++;
                for (var _b = 0, _c = best.bestandteile; _b < _c.length; _b++) {
                    var bt = _c[_b];
                    this.getRows(bt);
                }
            }
        }
    };
    PartsListsComponent.prototype.getRows = function (bestandteil) {
        this.column++;
        this.zeilen.push({ teil: bestandteil.typ + bestandteil.nummer, anzahl: bestandteil.anzahl, column: this.column });
        for (var _i = 0, _a = bestandteil.bestandteile; _i < _a.length; _i++) {
            var best = _a[_i];
            this.column++;
            this.zeilen.push({ teil: best.typ + best.nummer, anzahl: best.anzahl, column: this.column });
            if (best.bestandteile && best.bestandteile.length > 0) {
                this.columns++;
                for (var _b = 0, _c = best.bestandteile; _b < _c.length; _b++) {
                    var bt = _c[_b];
                    this.getRows(bt);
                }
            }
            this.column--;
        }
        this.column--;
    };
    PartsListsComponent.prototype.generateUebersicht = function () {
        var speichern = true;
        if (this.uebersicht) {
            while (this.uebersicht.length > 0) {
                this.uebersicht.pop();
            }
        }
        for (var _i = 0, _a = this.zeilen; _i < _a.length; _i++) {
            var z = _a[_i];
            speichern = true;
            for (var _b = 0, _c = this.uebersicht; _b < _c.length; _b++) {
                var u = _c[_b];
                if (u.teil == z.teil) {
                    u.anzahl += z.anzahl;
                    speichern = false;
                    break;
                }
            }
            if (speichern) {
                this.uebersicht.push({ teil: z.teil, anzahl: z.anzahl });
            }
        }
        this.uebersicht.sort(function (a, b) {
            var typA = a.teil.substring(0, 1).toUpperCase();
            var typB = b.teil.substring(0, 1).toUpperCase();
            var nummerA = Number.parseInt(a.teil.substring(1));
            var nummerB = Number.parseInt(b.teil.substring(1));
            if (typA < typB) {
                return -1;
            }
            if (typA > typB) {
                return 1;
            }
            if (typA == typB && nummerA < nummerB) {
                return -1;
            }
            if (typA == typB && nummerA > nummerB) {
                return 1;
            }
            return 0;
        });
        this.uebersicht.unshift({ teil: this.part.typ + this.part.nummer, anzahl: 1 });
    };
    PartsListsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'partsLists',
            templateUrl: 'partsLists.component.html'
        }), 
        __metadata('design:paramtypes', [part_service_1.PartService, session_service_1.SessionService, translate_pipe_1.TranslatePipe])
    ], PartsListsComponent);
    return PartsListsComponent;
}());
exports.PartsListsComponent = PartsListsComponent;
//# sourceMappingURL=partsLists.component.js.map