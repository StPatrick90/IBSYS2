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
var core_1 = require('@angular/core');
var session_service_1 = require('../../services/session.service');
var materialPlanning_service_1 = require('../../services/materialPlanning.service');
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
    MaterialPlanningComponent.prototype.setParameters = function () {
        this.getBruttoBedarfandPeriods();
        var i = 0;
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
                bruttobedarfnP: null,
                mengeohbest: null,
                bestellmenge: null,
                bestellung: null,
                bestandnWe: null
            };
            // collect values
            matPlanRow.kpartnr = purchPart.nummer;
            matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[i].startamount; // dbwerte falsch?
            matPlanRow.abweichung = purchPart.abweichung;
            matPlanRow.lieferfrist = purchPart.lieferfrist;
            matPlanRow.diskontmenge = purchPart.diskontmenge;
            matPlanRow.summe = Number((matPlanRow.lieferfrist + matPlanRow.abweichung).toFixed(2));
            for (var _b = 0, _c = purchPart.verwendung; _b < _c.length; _b++) {
                var vw = _c[_b];
                matPlanRow.verwendung.push(vw);
            }
            // get Verwendungen
            for (var l = 0; l <= matPlanRow.verwendung.length - 1; l++) {
                if (!this.verwendungRow.includes(matPlanRow.verwendung[l].Produkt)) {
                    this.verwendungRow.push(matPlanRow.verwendung[l].Produkt);
                }
            }
            // store values finally
            this.matPlan.push(matPlanRow);
            i++;
        }
        this.setColspan();
    };
    MaterialPlanningComponent.prototype.getBruttoBedarfandPeriods = function () {
        this.plannings = this.sessionService.getPlannings();
        console.log("planningsmat", this.plannings);
    };
    MaterialPlanningComponent.prototype.setColspan = function () {
        document.getElementById("Verwendung").setAttribute("colspan", String(this.verwendungRow.length));
        document.getElementById("Bruttobedarf").setAttribute("colspan", String(this.periodrow.length));
    };
    MaterialPlanningComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'materialPlanning',
            templateUrl: 'materialPlanning.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, materialPlanning_service_1.MaterialPlanningService, http_1.Http])
    ], MaterialPlanningComponent);
    return MaterialPlanningComponent;
}());
exports.MaterialPlanningComponent = MaterialPlanningComponent;
//# sourceMappingURL=materialPlanning.component.js.map