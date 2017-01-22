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
var translate_pipe_1 = require('../../translate/translate.pipe');
var MaterialPlanningEPComponent = (function () {
    function MaterialPlanningEPComponent(partService, sessionService, translatePipe) {
        this.partService = partService;
        this.sessionService = sessionService;
        this.translatePipe = translatePipe;
        this.columns = 14;
        this.partsList = Array();
        this.tmp_partsList = Array();
        this.partsListSingle = Array();
        //Model Daten für Inputs
        this.auftraegeVerbindl = Array();
        this.geplLagerbestand = Array();
        this.lagerbestandVorperiode = Array();
        this.auftraegeWarteschlAddiert = Array();
        this.auftraegeWarteschl = Array();
        this.auftraegeBearb = Array();
        this.prodAuftraege = Array();
        this.productOptions = Array();
        this.period = 0;
        //Forecast Data
        this.forecastVerbindlicheAuftraege = new Array();
        this.forecastGeplLager = new Array();
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
        if (this.sessionService.getResultObject()) {
            this.period = Number.parseInt(this.sessionService.getResultObject().results.period + 1);
        }
        if (this.sessionService.getForecast()) {
            this.forecast = this.sessionService.getForecast();
            if (this.forecast.period === this.period) {
                for (var _i = 0, _a = this.forecast.article; _i < _a.length; _i++) {
                    var article = _a[_i];
                    for (var _b = 0, _c = article.verbdindlicheAuftraege; _b < _c.length; _b++) {
                        var vA = _c[_b];
                        if (vA.periode === this.period) {
                            this.forecastVerbindlicheAuftraege.push({
                                id: article.partNr,
                                menge: vA.anzahl + article.direktVerkauf.menge
                            });
                        }
                    }
                    for (var _d = 0, _e = article.voraussichtlicherBestand; _d < _e.length; _d++) {
                        var vB = _e[_d];
                        if (vB.periode === this.period) {
                            this.forecastGeplLager.push({ id: article.partNr, menge: vB.anzahl });
                        }
                    }
                }
            }
        }
        if (this.sessionService.getParts() || this.sessionService.getResultObject()) {
            this.eParts = this.sessionService.getParts().filter(function (item) { return item.typ == "E"; });
            this.pParts = this.sessionService.getParts().filter(function (item) { return item.typ == "P"; });
            this.resultObj = this.sessionService.getResultObject();
            if (this.sessionService.getPlannedWarehouseStock()) {
                this.geplLagerbestand = this.sessionService.getPlannedWarehouseStock();
            }
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
        this.generatePartsList();
    };
    MaterialPlanningEPComponent.prototype.initMultiSelects = function () {
        for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
            var pt = _a[_i];
            this.productOptions.push({
                id: pt.nummer,
                name: this.translatePipe.transform(pt.bezeichnung.toString(), null)
            });
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
            checkAll: this.translatePipe.transform('combo_checkAll', null),
            uncheckAll: this.translatePipe.transform('combo_uncheckAll', null),
            checked: this.translatePipe.transform('combo_checked', null),
            checkedPlural: this.translatePipe.transform('combo_checkedPlural', null),
            searchPlaceholder: this.translatePipe.transform('combo_searchPlaceholder', null),
            defaultTitle: this.translatePipe.transform('combo_defaultTitle', null),
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
        for (var _i = 0, _a = this.forecastVerbindlicheAuftraege; _i < _a.length; _i++) {
            var va = _a[_i];
            if (this.part.nummer === va.id) {
                if (!this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + va.id]) {
                    this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + va.id] = va.menge;
                }
                if (!this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + va.id]) {
                    this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + va.id] = 0;
                }
            }
        }
        //Geplanter Lagerbestand Ende der Periode(Produkt 1,2,3)
        for (var _b = 0, _c = this.forecastGeplLager; _b < _c.length; _b++) {
            var la = _c[_b];
            if (this.part.nummer === la.id) {
                if (!this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + la.id]) {
                    this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + la.id] = la.menge;
                }
                for (var _d = 0, _e = this.tmp_partsList; _d < _e.length; _d++) {
                    var pl = _e[_d];
                    if (pl.teil.child.nummer !== la.id && !this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer]) {
                        this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = la.menge;
                    }
                }
            }
        }
        //Aufträge in Warteschlange
        for (var _f = 0, _g = this.warteschlangen.workplace; _f < _g.length; _f++) {
            var workplace = _g[_f];
            if (workplace.waitinglist) {
                if (workplace.waitinglist.length !== undefined) {
                    for (var _h = 0, _j = workplace.waitinglist; _h < _j.length; _h++) {
                        var wl = _j[_h];
                        for (var _k = 0, _l = this.tmp_partsList; _k < _l.length; _k++) {
                            var pl = _l[_k];
                            if (pl.teil.child.nummer === Number.parseInt(wl.item)) {
                                if (this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)]) {
                                    this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)] += Number.parseInt(wl.amount);
                                }
                                else {
                                    this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)] = Number.parseInt(wl.amount);
                                }
                            }
                        }
                    }
                }
                else {
                    for (var _m = 0, _o = this.tmp_partsList; _m < _o.length; _m++) {
                        var pl = _o[_m];
                        if (pl.teil.child.nummer === Number.parseInt(workplace.waitinglist.item)) {
                            if (this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)]) {
                                this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)] += Number.parseInt(workplace.waitinglist.amount);
                            }
                            else {
                                this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)] = Number.parseInt(workplace.waitinglist.amount);
                            }
                        }
                    }
                }
            }
        }
        //Lagerbestand Vorperiode
        for (var _p = 0, _q = this.lager.article; _p < _q.length; _p++) {
            var article = _q[_p];
            for (var _r = 0, _s = this.tmp_partsList; _r < _s.length; _r++) {
                var pl = _s[_r];
                if (pl.teil.child.nummer === Number.parseInt(article.id)) {
                    if (this.isGleichTeil(article.id)) {
                        this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + article.id] = (article.amount / 3).toFixed(2);
                    }
                    else {
                        this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + article.id] = article.amount;
                    }
                }
            }
        }
        //Aufträge in Bearbeitung
        for (var _t = 0, _u = this.bearbeitung.workplace; _t < _u.length; _t++) {
            var workplace = _u[_t];
            for (var _v = 0, _w = this.tmp_partsList; _v < _w.length; _v++) {
                var pl = _w[_v];
                if (pl.teil.child.nummer === Number.parseInt(workplace.item)) {
                    if (this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)]) {
                        this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)] += Number.parseInt(workplace.amount);
                    }
                    else {
                        this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)] = Number.parseInt(workplace.amount);
                    }
                }
            }
        }
        //Restliche Inputs mit default Werten füllen
        for (var _x = 0, _y = this.tmp_partsList; _x < _y.length; _x++) {
            var pl = _y[_x];
            if (!this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer]) {
                this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = 0;
            }
            if (!this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer]) {
                this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = 0;
            }
            if (!this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer]) {
                this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = 0;
            }
            if (pl.parent) {
                this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pl.teil.parent.nummer];
                this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.teil.parent.nummer];
            }
            this.updateArrays(true, false);
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
        for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
            var pt = _a[_i];
            this.part = pt;
            while (this.tmp_partsList && this.tmp_partsList.length > 0) {
                this.tmp_partsList.pop();
            }
            if (this.part != null) {
                this.tmp_partsList.push({ produkt: this.part.nummer, teil: { child: this.part, parent: null } });
                for (var _b = 0, _c = this.part.bestandteile; _b < _c.length; _b++) {
                    var best = _c[_b];
                    for (var _d = 0, _e = this.eParts; _d < _e.length; _d++) {
                        var pt_1 = _e[_d];
                        if (best._id == pt_1._id) {
                            this.getBestandteile(pt_1, this.part);
                        }
                    }
                }
                this.initArrays();
                for (var _f = 0, _g = this.tmp_partsList; _f < _g.length; _f++) {
                    var tmp = _g[_f];
                    this.partsList.push(tmp);
                }
            }
        }
    };
    MaterialPlanningEPComponent.prototype.getBestandteile = function (child, parent) {
        this.tmp_partsList.push({ produkt: this.part.nummer, teil: { child: child, parent: parent } });
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
    MaterialPlanningEPComponent.prototype.updateArrays = function (isInitial, clearMatPlan) {
        if (clearMatPlan) {
            this.sessionService.setMatPlan(null);
        }
        var parts = [];
        var ende = 4;
        if (isInitial) {
            parts = this.tmp_partsList;
        }
        else {
            parts = this.partsListSingle;
        }
        while (ende >= 0) {
            for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
                var pt = parts_1[_i];
                this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pt.teil.child.nummer] = this.sumProdAuftraege(pt.teil.child) < 0 ? 0 : this.sumProdAuftraege(pt.teil.child);
                if (pt.teil.parent) {
                    this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + pt.teil.child.nummer] = this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pt.teil.parent.nummer];
                    this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + pt.teil.child.nummer] = this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pt.teil.parent.nummer];
                }
            }
            ende--;
        }
        this.sessionService.setPartOrders(this.prodAuftraege);
        this.sessionService.setPlannedWarehouseStock(this.geplLagerbestand);
    };
    MaterialPlanningEPComponent.prototype.sumProdAuftraege = function (part) {
        return Math.ceil(this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + part.nummer] +
            this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + part.nummer] +
            this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + part.nummer]);
    };
    MaterialPlanningEPComponent.prototype.isGleichTeil = function (nummer) {
        var num = Number.parseInt(nummer);
        return num === 16 || num === 17 || num === 26;
    };
    MaterialPlanningEPComponent.prototype.filterList = function () {
        var _this = this;
        for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
            var pt = _a[_i];
            if (pt.nummer === Number.parseInt(this.auswahl)) {
                this.part = pt;
            }
        }
        this.partsListSingle = this.partsList.filter(function (item) { return item.produkt == _this.part.nummer; });
    };
    MaterialPlanningEPComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'materialPlanningEP',
            templateUrl: 'materialPlanningEP.component.html'
        }), 
        __metadata('design:paramtypes', [part_service_1.PartService, session_service_1.SessionService, translate_pipe_1.TranslatePipe])
    ], MaterialPlanningEPComponent);
    return MaterialPlanningEPComponent;
}());
exports.MaterialPlanningEPComponent = MaterialPlanningEPComponent;
//# sourceMappingURL=materialPlanningEP.component.js.map