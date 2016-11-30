/**
 * Created by philipp.koepfer on 24.11.16.
 */
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
var db_service_1 = require('../../services/db.service');
var dashTask_1 = require('../../model/dashTask');
var DashboardComponent = (function () {
    function DashboardComponent(sessionService, dbService) {
        var _this = this;
        this.allResults = [];
        this.resultObj = sessionService.getResultObject();
        this.warnings = [];
        this.normals = [];
        this.goods = [];
        this.criticals = [];
        dbService.getResults()
            .subscribe(function (results) { _this.allResults = results; }, function (err) { return console.log(err); }, function () { return console.log("Periods loaded!"); });
        this.getStorageValues();
    }
    /*+ function(){
     $('.clickable').on('click',function(){
         var effect = $(this).data('effect');
         $(this).closest('.panel')[effect]();
     })
 })*/
    DashboardComponent.prototype.deleteClicked = function (dashTask) {
        if (dashTask.art == "critical") {
            var index = this.criticals.indexOf(dashTask);
            this.criticals.splice(index, 1);
        }
        if (dashTask.art == "warning") {
            var index = this.criticals.indexOf(dashTask);
            this.warnings.splice(index, 1);
        }
        if (dashTask.art == "good") {
            var index = this.criticals.indexOf(dashTask);
            this.goods.splice(index, 1);
        }
    };
    DashboardComponent.prototype.getStorageValues = function () {
        var storage = [];
        storage = this.resultObj.results.warehousestock.article;
        console.log(this.resultObj);
        for (var i = 0; i < storage.length; i++) {
            var amount = parseInt(storage[i].amount, 10);
            var startamount = parseInt(storage[i].startamount, 10);
            if (amount <= (startamount * 0.1)) {
                var crit = new dashTask_1.DashTask;
                crit.id = this.criticals.length;
                crit.name = "Weniger als 10% im Lager!";
                crit.art = "critical";
                crit.link = "/capacityPlanning";
                crit.value = amount;
                this.criticals.push(crit);
                continue;
            }
            if (amount <= (startamount * 0.4)) {
                var warn = new dashTask_1.DashTask;
                warn.id = this.warnings.length;
                warn.name = "Weniger als 40% im Lager!";
                warn.art = "warning";
                warn.link = "/capacityPlanning";
                warn.value = amount;
                this.warnings.push(warn);
                continue;
            }
            if (amount >= startamount) {
                var good = new dashTask_1.DashTask;
                good.id = this.goods.length;
                good.name = "100% und mehr im Lager verfügbar!";
                good.art = "good";
                good.link = "/capacityPlanning";
                good.value = amount;
                this.goods.push(good);
                continue;
            }
        }
    };
    DashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'xmlImport',
            templateUrl: 'dashboard.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, db_service_1.DBService])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map