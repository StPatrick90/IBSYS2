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
 * Created by Paddy on 18.12.2016.
 */
var core_1 = require('@angular/core');
var part_service_1 = require('../../services/part.service');
var session_service_1 = require('../../services/session.service');
var MaterialPlanningEPComponent = (function () {
    function MaterialPlanningEPComponent(partService, sessionService) {
        this.partService = partService;
        this.sessionService = sessionService;
        this.columns = 14;
        this.partsList = Array();
        //Model Daten für Inputs
        this.auftraegeVerbindl = Array();
        this.geplLagerbestand = Array();
        this.lagerbestandVorperiode = Array();
        this.auftraegeWarteschlAddiert = Array();
        this.auftraegeWarteschl = Array();
        this.auftraegeBearb = Array();
        this.prodAuftraege = Array();
        this.productOptions = Array();
        //MOCK DATA
        this.mockVerbindlicheAuftraege = [{ id: 1, menge: 100 }, { id: 2, menge: 200 }, { id: 3, menge: 150 }];
        this.mockGeplLager = [{ id: 1, menge: 50 }, { id: 2, menge: 60 }, { id: 3, menge: 70 }];
        this.getNumber = function (num) {
            var array = Array();
            for (var i = 1; i <= num; i++) {
                array.push(i);
            }
            return array;
        };
    }
    MaterialPlanningEPComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.sessionService.getParts() != null || this.sessionService.getParts() != undefined ||
            this.sessionService.getResultObject() != null || this.sessionService.getResultObject() != undefined) {
            this.eParts = this.sessionService.getParts().filter(function (item) { return item.typ == "E"; });
            this.pParts = this.sessionService.getParts().filter(function (item) { return item.typ == "P"; });
            this.resultObj = this.sessionService.getResultObject();
            this.initAll();
        }
        else {
            this.partService.getParts()
                .subscribe(function (data) {
                _this.eParts = data.filter(function (item) { return item.typ == "E"; });
                _this.pParts = data.filter(function (item) { return item.typ == "P"; });
            }, function (err) { return console.error(err); }, function () { return _this.initAll(); });
        }
    };
    MaterialPlanningEPComponent.prototype.initAll = function () {
        this.initMultiSelects();
        this.initVariables();
    };
    MaterialPlanningEPComponent.prototype.initMultiSelects = function () {
        for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
            var pt = _a[_i];
            this.productOptions.push({ id: pt.nummer, name: pt.bezeichnung.toString() });
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
    MaterialPlanningEPComponent.prototype.initArrays = function () {
        while (this.auftraegeWarteschl && this.auftraegeWarteschl.length > 0) {
            this.auftraegeWarteschl.pop();
        }
        while (this.auftraegeBearb && this.auftraegeBearb.length > 0) {
            this.auftraegeBearb.pop();
        }
        //Verbindliche Aufträge (Produkt 1,2,3) und Addierte Warteschlangen für Produkte 0
        for (var _i = 0, _a = this.mockVerbindlicheAuftraege; _i < _a.length; _i++) {
            var va = _a[_i];
            if (!this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + va.id]) {
                this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + va.id] = va.menge;
            }
            if (!this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + va.id]) {
                this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + va.id] = 0;
            }
        }
        //Geplanter Lagerbestand Ende der Periode(Produkt 1,2,3)
        for (var _b = 0, _c = this.mockGeplLager; _b < _c.length; _b++) {
            var la = _c[_b];
            if (!this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + la.id]) {
                this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + la.id] = la.menge;
            }
        }
        //Aufträge in Warteschlange
        for (var _d = 0, _e = this.warteschlangen.workplace; _d < _e.length; _d++) {
            var workplace = _e[_d];
            if (workplace.waitinglist) {
                if (workplace.waitinglist.length !== undefined) {
                    for (var _f = 0, _g = workplace.waitinglist; _f < _g.length; _f++) {
                        var wl = _g[_f];
                        if (this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)]) {
                            this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)] += Number.parseInt(wl.amount);
                        }
                        else {
                            this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)] = Number.parseInt(wl.amount);
                        }
                    }
                }
                else {
                    if (this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)]) {
                        this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)] += Number.parseInt(workplace.waitinglist.amount);
                    }
                    else {
                        this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)] = Number.parseInt(workplace.waitinglist.amount);
                    }
                }
            }
        }
        //Lagerbestand Vorperiode
        for (var _h = 0, _j = this.lager.article; _h < _j.length; _h++) {
            var article = _j[_h];
            if (this.isGleichTeil(article.id)) {
                this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + article.id] = (article.amount / 3).toFixed(2);
            }
            else {
                this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + article.id] = article.amount;
            }
        }
        //Aufträge in Bearbeitung
        for (var _k = 0, _l = this.bearbeitung.workplace; _k < _l.length; _k++) {
            var workplace = _l[_k];
            if (this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)]) {
                this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)] += Number.parseInt(workplace.amount);
            }
            else {
                this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)] = Number.parseInt(workplace.amount);
            }
        }
        //Restliche Inputs mit default Werten füllen
        for (var _m = 0, _o = this.partsList; _m < _o.length; _m++) {
            var pl = _o[_m];
            if (!this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.child.nummer]) {
                this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.child.nummer] = 0;
            }
            if (!this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + pl.child.nummer]) {
                this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + pl.child.nummer] = 0;
            }
            if (!this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.child.nummer]) {
                this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.child.nummer] = 0;
            }
            if (pl.parent) {
                this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + pl.child.nummer] = this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pl.parent.nummer];
                this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + pl.child.nummer] = this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.parent.nummer];
            }
            this.updateArrays();
        }
    };
    MaterialPlanningEPComponent.prototype.initVariables = function () {
        this.warteschlangen = this.resultObj.results.waitinglistworkstations;
        this.lager = this.resultObj.results.warehousestock;
        this.bearbeitung = this.resultObj.results.ordersinwork;
    };
    MaterialPlanningEPComponent.prototype.generatePartsList = function () {
        while (this.partsList.length > 0) {
            this.partsList.pop();
        }
        if (this.auswahl != undefined && this.auswahl.length == 1) {
            for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
                var pt = _a[_i];
                if (pt.nummer == this.auswahl[0]) {
                    this.part = pt;
                }
            }
            if (this.part != null) {
                this.partsList.push({ child: this.part, parent: null });
                for (var _b = 0, _c = this.part.bestandteile; _b < _c.length; _b++) {
                    var best = _c[_b];
                    for (var _d = 0, _e = this.eParts; _d < _e.length; _d++) {
                        var pt = _e[_d];
                        if (best._id == pt._id) {
                            this.getBestandteile(pt, this.part);
                        }
                    }
                }
            }
        }
        this.initArrays();
    };
    MaterialPlanningEPComponent.prototype.getBestandteile = function (child, parent) {
        this.partsList.push({ child: child, parent: parent });
        if (child.bestandteile && child.bestandteile.length > 0) {
            for (var _i = 0, _a = child.bestandteile; _i < _a.length; _i++) {
                var best = _a[_i];
                for (var _b = 0, _c = this.eParts; _b < _c.length; _b++) {
                    var pt = _c[_b];
                    if (best._id == pt._id) {
                        this.getBestandteile(pt, child);
                    }
                }
            }
        }
    };
    MaterialPlanningEPComponent.prototype.updateArrays = function () {
        for (var _i = 0, _a = this.partsList; _i < _a.length; _i++) {
            var pt = _a[_i];
            this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pt.child.nummer] = this.sumProdAuftraege(pt.child) < 0 ? 0 : this.sumProdAuftraege(pt.child);
            if (pt.parent) {
                this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + pt.child.nummer] = this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pt.parent.nummer];
                this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + pt.child.nummer] = this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pt.parent.nummer];
            }
        }
        this.sessionService.setPartOrders(this.prodAuftraege);
    };
    MaterialPlanningEPComponent.prototype.sumProdAuftraege = function (part) {
        return this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + part.nummer] +
            this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + part.nummer] +
            this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + part.nummer];
    };
    MaterialPlanningEPComponent.prototype.isGleichTeil = function (nummer) {
        var num = Number.parseInt(nummer);
        return num === 16 || num === 17 || num === 26;
    };
    MaterialPlanningEPComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'materialPlanningEP',
            templateUrl: 'materialPlanningEP.component.html'
        }), 
        __metadata('design:paramtypes', [part_service_1.PartService, session_service_1.SessionService])
    ], MaterialPlanningEPComponent);
    return MaterialPlanningEPComponent;
}());
exports.MaterialPlanningEPComponent = MaterialPlanningEPComponent;
//# sourceMappingURL=materialPlanningEP.component.js.map