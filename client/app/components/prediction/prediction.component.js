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
var prediction_service_1 = require('../../services/prediction.service');
var db_service_1 = require('../../services/db.service');
var PredictionComponent = (function () {
    function PredictionComponent(sessionService, predictionService, dbService) {
        this.predictionService = predictionService;
        this.dbService = dbService;
        this.periods = [];
        this.sumsBo = [];
        this.sumsPl = [];
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
        this.bindingOrders = new Array();
        this.plannings = new Array();
    }
    PredictionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.predictionService.getBindingOrders()
            .subscribe(function (bindingOrders) {
            _this.bindingOrders = bindingOrders;
            _this.sumBindingOrders();
        });
        this.predictionService.getPlannings()
            .subscribe(function (plannings) {
            _this.plannings = plannings;
            _this.generateRowsRemainingStock();
        });
        this.dbService.getResults()
            .subscribe(function (results) {
            _this.results = results;
            console.log(_this.results);
        });
    };
    PredictionComponent.prototype.sumBindingOrders = function () {
        this.period = parseInt(this.resultObjs.results.period, 10);
        this.periods.push(this.period);
        this.periods.push(this.period + 1);
        this.periods.push(this.period + 2);
        this.periods.push(this.period + 3);
        for (var i = 0; i < this.bindingOrders.length; i++) {
            if (this.periods[i] == this.bindingOrders[i].period) {
                var p1 = parseInt(this.bindingOrders[i].product1, 10);
                var p2 = parseInt(this.bindingOrders[i].product2, 10);
                var p3 = parseInt(this.bindingOrders[i].product3, 10);
                var sumBo = p1 + p2 + p3;
                this.sumsBo.push(sumBo);
            }
        }
    };
    PredictionComponent.prototype.sumPlannedOrders = function () {
        this.period = parseInt(this.resultObjs.results.period, 10);
        this.periods.push(this.period);
        this.periods.push(this.period + 1);
        this.periods.push(this.period + 2);
        this.periods.push(this.period + 3);
        for (var i = 0; i < this.plannings.length; i++) {
            if (this.periods[i] == this.plannings[i].period) {
                var p1 = parseInt(this.plannings[i].product1, 10);
                var p2 = parseInt(this.plannings[i].product2, 10);
                var p3 = parseInt(this.plannings[i].product3, 10);
                var sumPl = p1 + p2 + p3;
                this.sumsPl.push(sumPl);
            }
        }
    };
    PredictionComponent.prototype.generateRowsRemainingStock = function () {
        for (var _i = 0, _a = this.resultObjs.results.warehousestock.article; _i < _a.length; _i++) {
            var art = _a[_i];
            var _id = parseInt(art.id, 10);
            if (_id == 1) {
                var re = parseInt(this.resultObjs.results.warehousestock.article[0].amount, 10);
                var pl = parseInt(this.plannings[0].product1, 10);
                var bo = parseInt(this.bindingOrders[0].product1, 10);
                this.row1res = re + pl - bo;
                var pl2 = parseInt(this.plannings[1].product1, 10);
                var bo2 = parseInt(this.bindingOrders[1].product1, 10);
                this.row1res2 = this.row1res + pl2 - bo2;
                var pl3 = parseInt(this.plannings[2].product1, 10);
                var bo3 = parseInt(this.bindingOrders[2].product1, 10);
                this.row1res3 = this.row1res2 + pl3 - bo3;
                var pl4 = parseInt(this.plannings[3].product1, 10);
                var bo4 = parseInt(this.bindingOrders[3].product1, 10);
                this.row1res4 = this.row1res3 + pl4 - bo4;
            }
            else if (_id == 2) {
                var re = parseInt(this.resultObjs.results.warehousestock.article[1].amount, 10);
                var pl = parseInt(this.plannings[0].product2, 10);
                var bo = parseInt(this.bindingOrders[0].product2, 10);
                this.row2res = re + pl - bo;
                var pl2 = parseInt(this.plannings[1].product2, 10);
                var bo2 = parseInt(this.bindingOrders[1].product2, 10);
                this.row2res2 = this.row2res + pl2 - bo2;
                var pl3 = parseInt(this.plannings[2].product2, 10);
                var bo3 = parseInt(this.bindingOrders[2].product2, 10);
                this.row2res3 = this.row2res2 + pl3 - bo3;
                var pl4 = parseInt(this.plannings[3].product2, 10);
                var bo4 = parseInt(this.bindingOrders[3].product2, 10);
                this.row2res4 = this.row2res3 + pl4 - bo4;
            }
            else if (_id == 3) {
                var re = parseInt(this.resultObjs.results.warehousestock.article[2].amount, 10);
                var pl = parseInt(this.plannings[0].product3, 10);
                var bo = parseInt(this.bindingOrders[0].product3, 10);
                this.row3res = re + pl - bo;
                var pl2 = parseInt(this.plannings[1].product3, 10);
                var bo2 = parseInt(this.bindingOrders[1].product3, 10);
                this.row3res2 = this.row3res + pl2 - bo2;
                var pl3 = parseInt(this.plannings[2].product3, 10);
                var bo3 = parseInt(this.bindingOrders[2].product3, 10);
                this.row3res3 = this.row3res2 + pl3 - bo3;
                var pl4 = parseInt(this.plannings[3].product3, 10);
                var bo4 = parseInt(this.bindingOrders[3].product3, 10);
                this.row3res4 = this.row3res3 + pl4 - bo4;
            }
        }
    };
    PredictionComponent.prototype.generatePeriods = function (index) {
        this.period = parseInt(this.resultObjs.results.period, 10);
        this.periods.push(this.period);
        this.periods.push(this.period + 1);
        this.periods.push(this.period + 2);
        this.periods.push(this.period + 3);
        return this.periods[index];
    };
    PredictionComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'prediction',
            templateUrl: 'prediction.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, prediction_service_1.PredictionService, db_service_1.DBService])
    ], PredictionComponent);
    return PredictionComponent;
}());
exports.PredictionComponent = PredictionComponent;
//# sourceMappingURL=prediction.component.js.map