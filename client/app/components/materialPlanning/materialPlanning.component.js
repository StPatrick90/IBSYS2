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
var matPlanRow_1 = require("../../model/matPlanRow");
var MaterialPlanningComponent = (function () {
    function MaterialPlanningComponent(sessionService, materialPlanningService) {
        this.sessionService = sessionService;
        this.materialPlanningService = materialPlanningService;
        this.resultObj = this.sessionService.getResultObject();
        this.matPlanRow = new matPlanRow_1.matPlanRow();
        this.matPlan = new Array();
        this.verwendungRow = new Array();
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
        for (var i = 0; i <= this.purchaseParts.length - 1; i++) {
            // declaration
            var matPlanRow = {
                kpartnr: this.matPlanRow.kpartnr,
                lieferfrist: this.matPlanRow.lieferfrist,
                abweichung: this.matPlanRow.abweichung,
                summe: this.matPlanRow.summe,
                verwendung: this.matPlanRow.verwendung,
                diskontmenge: this.matPlanRow.diskontmenge,
                anfangsbestand: this.matPlanRow.anfangsbestand,
                bruttobedarfnP: this.matPlanRow.bruttobedarfnP,
                mengeohbest: this.matPlanRow.mengeohbest,
                bestellmenge: this.matPlanRow.bestellmenge,
                bestellung: this.matPlanRow.bestellung,
                bestandnWe: this.matPlanRow.bestandnWe
            };
            // collect values
            matPlanRow.kpartnr = this.purchaseParts[i].nummer;
            matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[i].startamount; // dbwerte falsch?
            matPlanRow.abweichung = this.purchaseParts[i].abweichung;
            matPlanRow.lieferfrist = this.purchaseParts[i].lieferfrist;
            matPlanRow.diskontmenge = this.purchaseParts[i].diskontmenge;
            matPlanRow.summe = Number((matPlanRow.lieferfrist + matPlanRow.abweichung).toFixed(2));
            for (var v = 0; v <= this.purchaseParts[i].verwendung.length - 1; v++) {
                matPlanRow.verwendung[v] = { Produkt: "", Menge: 0 };
                matPlanRow.verwendung[v].Menge = this.purchaseParts[i].verwendung[v].Menge;
                matPlanRow.verwendung[v].Produkt = this.purchaseParts[i].verwendung[v].Produkt;
            }
            // console.log("MPRV", matPlanRow.verwendung);
            // console.log("MPRVM", matPlanRow.verwendung[2].Menge);
            // get Produktverwendungen für Kopfzeile
            for (var l = 0; l <= matPlanRow.verwendung.length - 1; l++) {
                if (!this.verwendungRow.includes(matPlanRow.verwendung[l].Produkt)) {
                    this.verwendungRow.push(matPlanRow.verwendung[l].Produkt);
                }
            }
            // store them finally
            this.matPlan[i] = matPlanRow;
            console.log(this.matPlan[i].verwendung[1].Menge);
        }
        this.setColspan();
    };
    MaterialPlanningComponent.prototype.setColspan = function () {
        document.getElementById("Verwendung").setAttribute("colspan", String(this.verwendungRow.length));
    };
    MaterialPlanningComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'materialPlanning',
            templateUrl: 'materialPlanning.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, materialPlanning_service_1.MaterialPlanningService])
    ], MaterialPlanningComponent);
    return MaterialPlanningComponent;
}());
exports.MaterialPlanningComponent = MaterialPlanningComponent;
//# sourceMappingURL=materialPlanning.component.js.map