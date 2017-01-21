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
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var translate_service_1 = require("../../translate/translate.service");
var DashboardComponent = (function () {
    function DashboardComponent(sessionService, dbService, translation) {
        var _this = this;
        this.translation = translation;
        this.allResults = [];
        this.dashTaskTypes = [];
        this.selectedType = [];
        this.resultObj = sessionService.getResultObject();
        this.warnings = [];
        this.normals = [];
        this.goods = [];
        this.criticals = [];
        dbService.getResults()
            .subscribe(function (results) { _this.allResults = results; }, function (err) { return console.log(err); }, function () { return console.log("Periods loaded!"); });
        this.dashTaskTypes.push(this.translation.instant('dashboard_warehouse'));
        this.dashTaskTypes.push(this.translation.instant('dashboard_deliver'));
        this.selectedType.push(this.translation.instant('dashboard_warehouse'));
        this.selectedType.push(this.translation.instant('dashboard_deliver'));
        this.bootstrapDashTasks();
    }
    DashboardComponent.prototype.setConfig = function () {
        this.modalConfig.open();
    };
    DashboardComponent.prototype.closeConfig = function () {
        this.bootstrapDashTasks();
        this.modalConfig.close();
    };
    DashboardComponent.prototype.bootstrapDashTasks = function () {
        this.warnings.length = 0;
        this.normals.length = 0;
        this.goods.length = 0;
        this.criticals.length = 0;
        for (var i = 0; i < this.selectedType.length; i++) {
            if (this.selectedType[i] === "Warehouse" || this.selectedType[i] === "Lager") {
                this.getStorageValues();
            }
            if (this.selectedType[i] === "Delivery Reliability" || this.selectedType[i] === "Liefertreue") {
                this.getDeliveryreliability();
            }
        }
    };
    DashboardComponent.prototype.clickRadio = function (type) {
        for (var i = 0; i < this.selectedType.length; i++) {
            if (type == this.selectedType[i]) {
                this.selectedType.splice(i, 1);
                return;
            }
        }
        this.selectedType.push(type);
    };
    DashboardComponent.prototype.isSelected = function (type) {
        for (var i = 0; i < this.selectedType.length; i++) {
            if (type == this.selectedType[i])
                return true;
        }
        return false;
    };
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
    DashboardComponent.prototype.getDeliveryreliability = function () {
        var warnValue = 0.99;
        var goodValue = 1;
        var deliveryObject = this.resultObj.results.result.general.deliveryreliability;
        var currentString = deliveryObject.current.slice(0, -1);
        var current = parseInt(currentString);
        if (current >= goodValue) {
            var good = new dashTask_1.DashTask();
            good.art = "good";
            good.from = "deliveryreliability";
            good.link = "/prediction";
            good.displayValue = deliveryObject.current;
            good.id = this.goods.length;
            this.goods.push(good);
            return;
        }
        if (current >= warnValue) {
            var warn = new dashTask_1.DashTask();
            warn.art = "warning";
            warn.from = "deliveryreliability";
            warn.link = "/prediction";
            warn.displayValue = deliveryObject.current;
            warn.id = this.goods.length;
            this.warnings.push(warn);
            return;
        }
        if (current) {
            var crit = new dashTask_1.DashTask();
            crit.art = "critical";
            crit.from = "deliveryreliability";
            crit.link = "/prediction";
            crit.displayValue = deliveryObject.current;
            crit.id = this.goods.length;
            this.criticals.push(crit);
            return;
        }
    };
    DashboardComponent.prototype.getStorageValues = function () {
        var storage = [];
        storage = this.resultObj.results.warehousestock.article;
        var critValue = 0.05;
        var warnValue = 0.2;
        //goodValue = startamount
        for (var i = 0; i < storage.length; i++) {
            var amount = parseInt(storage[i].amount, 10);
            var startamount = parseInt(storage[i].startamount, 10);
            if (amount <= (startamount * critValue)) {
                var crit = new dashTask_1.DashTask;
                crit.id = this.criticals.length;
                crit.displayValue = critValue.toString();
                crit.art = "critical";
                crit.link = "/capacityPlanning";
                crit.article = storage[i].id;
                crit.value = amount;
                crit.from = "warehousestock";
                this.criticals.push(crit);
                continue;
            }
            if (amount <= (startamount * warnValue)) {
                var warn = new dashTask_1.DashTask;
                warn.id = this.warnings.length;
                warn.displayValue = warnValue.toString();
                warn.art = "warning";
                warn.link = "/capacityPlanning";
                warn.article = storage[i].id;
                warn.value = amount;
                warn.from = "warehousestock";
                this.warnings.push(warn);
                continue;
            }
            if (amount > startamount) {
                var good = new dashTask_1.DashTask;
                good.id = this.goods.length;
                good.displayValue = (Math.floor(((amount / startamount) * 100)) / 100).toString();
                good.art = "good";
                good.link = "/capacityPlanning";
                good.article = storage[i].id;
                good.value = amount;
                good.from = "warehousestock";
                this.goods.push(good);
                continue;
            }
        }
    };
    __decorate([
        core_1.ViewChild('configuration'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], DashboardComponent.prototype, "modalConfig", void 0);
    DashboardComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'xmlImport',
            templateUrl: 'dashboard.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, db_service_1.DBService, translate_service_1.TranslateService])
    ], DashboardComponent);
    return DashboardComponent;
}());
exports.DashboardComponent = DashboardComponent;
//# sourceMappingURL=dashboard.component.js.map