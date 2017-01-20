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
        this.produktKennungen = [];
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
        this.bindingOrders = new Array();
        this.plannings = new Array();
        this.bindingtable = new Array();
        this.rowtable1 = new Array();
        this.rowtable2 = new Array();
        this.rowtable3 = new Array();
    }
    PredictionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.dbService.getResults()
            .subscribe(function (results) {
            _this.results = results;
        });
        this.getBindingOrdersAndPlannings();
    };
    PredictionComponent.prototype.getBindingOrdersAndPlannings = function () {
        var _this = this;
        this.predictionService.getBindingOrdersAndPlannings()
            .subscribe(function (data) {
            _this.bindingOrders = data[0];
            _this.plannings = data[1];
        }, function (err) { return console.error(err); }, function () { return _this.generatePlanningsTable(); }, function () { return _this.generateBindingOrdersTable(); }, function () { return _this.generateTableRemainingStock(); });
    };
    PredictionComponent.prototype.generatePlanningsTable = function () {
        var produktKennung = this.plannings[0].produkte[0].Kennung;
        for (var i = 0; i < this.plannings[0].produkte.length; i++) {
            var row2 = {
                produkt: null,
                produktkennung: "",
                produktmengen: []
            };
            for (var _i = 0, _a = this.plannings; _i < _a.length; _i++) {
                var p = _a[_i];
                for (var _b = 0, _c = p.produkte; _b < _c.length; _b++) {
                    var produkt = _c[_b];
                    if (produkt.Kennung === produktKennung) {
                        row2.produktkennung = produkt.Kennung;
                        row2.produktmengen.push(produkt.Menge);
                        row2.produktkennung = produkt.Kennung;
                    }
                }
            }
            this.rowtable2.push(row2);
            if (i + 1 !== this.plannings[0].produkte.length) {
                produktKennung = this.plannings[0].produkte[i + 1].Kennung;
            }
            this.produktKennungen = this.plannings[0].produkte[i].Kennung;
        }
        this.sessionService.setPlannings(this.rowtable2);
    };
    PredictionComponent.prototype.generateBindingOrdersTable = function () {
        var produktKennung = this.bindingOrders[0].produkte[0].Kennung;
        for (var i = 0; i < this.bindingOrders[0].produkte.length; i++) {
            var row = {
                produkt: null,
                produktkennung: "",
                produktmengen: []
            };
            for (var _i = 0, _a = this.bindingOrders; _i < _a.length; _i++) {
                var bindingOrder = _a[_i];
                for (var _b = 0, _c = bindingOrder.produkte; _b < _c.length; _b++) {
                    var produkt = _c[_b];
                    if (produkt.Kennung === produktKennung) {
                        row.produktkennung = produkt.Kennung;
                        row.produktmengen.push(produkt.Menge);
                    }
                }
            }
            if (i + 1 !== this.bindingOrders[0].produkte.length) {
                produktKennung = this.bindingOrders[0].produkte[i + 1].Kennung;
            }
            this.rowtable1.push(row);
        }
        this.sessionService.setbindingOrders(this.rowtable1);
    };
    PredictionComponent.prototype.generateTableRemainingStock = function () {
        for (var i = 0; i < this.plannings[0].produkte.length; i++) {
            var row3 = {
                produkt: null,
                produktkennung: "",
                produktmengen: []
            };
            row3.produktkennung = this.produktKennungen[i];
            var re = parseInt(this.resultObjs.results.warehousestock.article[i].amount, 10);
            var pl = parseInt(this.plannings[0].produkte[i].menge, 10);
            var bo = parseInt(this.bindingOrders[0].produkte[i].menge, 10);
            var val1 = re + pl - bo;
            row3.produktmengen.push(val1);
            for (var k = 1; k < 3; k++) {
                var pl2 = parseInt(this.plannings[k].produkte[i].menge);
                var bo2 = parseInt(this.bindingOrders[k].produkte[i].menge);
                var val2 = val1 + pl2 - bo2;
                row3.produktmengen.push(val2);
                val1 = val2;
            }
            this.rowtable3.push(row3);
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