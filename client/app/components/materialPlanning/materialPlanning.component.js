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
var core_1 = require("@angular/core");
var session_service_1 = require("../../services/session.service");
var materialPlanning_service_1 = require("../../services/materialPlanning.service");
var http_1 = require("@angular/http");
var MaterialPlanningComponent = (function () {
    function MaterialPlanningComponent(sessionService, materialPlanningService, http) {
        this.sessionService = sessionService;
        this.materialPlanningService = materialPlanningService;
        this.http = http;
        this.resultObj = this.sessionService.getResultObject();
        this.matPlan = new Array();
        this.verwendungRow = new Array();
        this.periodrow = new Array();
        this.plannings = new Array();
        this.getKParts();
    }
    MaterialPlanningComponent.prototype.getKParts = function () {
        var _this = this;
        this.materialPlanningService.getKParts()
            .subscribe(function (data) {
            _this.purchaseParts = data;
        }, function (err) { return console.error(err); }, function () { return _this.setParameters(); });
    };
    ;
    //TODO: Perioden von Yannik über session service holen (derzeit kommt immer nur die selbe), danach restliche tabelle
    MaterialPlanningComponent.prototype.setParameters = function () {
        console.log("result: ", this.resultObj);
        this.getBruttoBedarfandPeriods();
        var index = 0;
        for (var _i = 0, _a = this.purchaseParts; _i < _a.length; _i++) {
            var purchPart = _a[_i];
            var matPlanRow = {
                kpartnr: null,
                lieferfrist: null,
                abweichung: null,
                summe: null,
                verwendung: [],
                diskontmenge: null,
                anfangsbestand: null,
                bruttobedarfnP: [],
                mengeohbest: null,
                bestellmenge: null,
                bestellung: null,
                bestandnWe: null,
                isneg: null
            };
            // collect values
            matPlanRow.kpartnr = purchPart.nummer;
            index = matPlanRow.kpartnr - 1;
            matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[index].startamount;
            matPlanRow.abweichung = purchPart.abweichung;
            matPlanRow.lieferfrist = purchPart.lieferfrist;
            matPlanRow.diskontmenge = purchPart.diskontmenge; // werte bei diskontmenge in db und excel unterscheiden sich, auch ab überprüfen
            matPlanRow.summe = Number((matPlanRow.lieferfrist + matPlanRow.abweichung).toFixed(2));
            // get Verwendungen
            for (var _b = 0, _c = purchPart.verwendung; _b < _c.length; _b++) {
                var vw = _c[_b];
                matPlanRow.verwendung.push(vw);
            }
            // get Bruttobedarf
            matPlanRow.bruttobedarfnP.push(0);
            for (var _d = 0, _e = this.plannings; _d < _e.length; _d++) {
                var p = _e[_d];
                while (matPlanRow.bruttobedarfnP.length < p.produktmengen.length) {
                    matPlanRow.bruttobedarfnP.push(0);
                }
                if (this.periodrow.length < 4) {
                    this.periodrow.push(p.period);
                }
            }
            for (var _f = 0, _g = purchPart.verwendung; _f < _g.length; _f++) {
                var vw = _g[_f];
                for (var _h = 0, _j = this.plannings; _h < _j.length; _h++) {
                    var p = _j[_h];
                    if (vw.Produkt === p.produktkennung) {
                        for (var i = 0; i < matPlanRow.bruttobedarfnP.length; i++) {
                            matPlanRow.bruttobedarfnP[i] += vw.Menge * p.produktmengen[i];
                        }
                    }
                }
            }
            // get Menge ohne Bestellung
            matPlanRow.mengeohbest = matPlanRow.anfangsbestand;
            for (var i = 0; i < matPlanRow.bruttobedarfnP.length; i++) {
                matPlanRow.mengeohbest = matPlanRow.mengeohbest - matPlanRow.bruttobedarfnP[i];
            }
            if (matPlanRow.mengeohbest < 0) {
                matPlanRow.isneg = true;
            }
            else {
                matPlanRow.isneg = false;
            }
            // set Normal-/Eilbestellung
            if (matPlanRow.mengeohbest < 0 && matPlanRow.summe * matPlanRow.bruttobedarfnP[0] > matPlanRow.anfangsbestand) {
                matPlanRow.bestellung = "Eil.";
            }
            else {
                if (matPlanRow.mengeohbest <= 0) {
                    matPlanRow.bestellung = "Norm.";
                }
                else {
                    matPlanRow.bestellung = "---";
                }
            }
            // get Verwendungsarten
            for (var l = 0; l <= matPlanRow.verwendung.length - 1; l++) {
                if (!this.verwendungRow.includes(matPlanRow.verwendung[l].Produkt)) {
                    this.verwendungRow.push(matPlanRow.verwendung[l].Produkt);
                }
            }
            // store values finally
            this.matPlan.push(matPlanRow);
        }
        this.setColspan();
    };
    MaterialPlanningComponent.prototype.getBruttoBedarfandPeriods = function () {
        this.plannings = this.sessionService.getPlannings();
        if (this.plannings === null) {
            alert("Bitte erst die Prognose durchführen.");
        }
    };
    MaterialPlanningComponent.prototype.setColspan = function () {
        document.getElementById("Verwendung").setAttribute("colspan", String(this.verwendungRow.length));
        document.getElementById("Bruttobedarf").setAttribute("colspan", String(4));
    };
    return MaterialPlanningComponent;
}());
MaterialPlanningComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'materialPlanning',
        templateUrl: 'materialPlanning.component.html'
    }),
    __metadata("design:paramtypes", [session_service_1.SessionService, materialPlanning_service_1.MaterialPlanningService, http_1.Http])
], MaterialPlanningComponent);
exports.MaterialPlanningComponent = MaterialPlanningComponent;
//# sourceMappingURL=materialPlanning.component.js.map