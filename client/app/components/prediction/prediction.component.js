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
        this.bindingtable = new Array();
        this.rowtable1 = new Array();
        this.rowtable2 = new Array();
    }
    PredictionComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.predictionService.getBindingOrders()
            .subscribe(function (bindingOrders) {
            _this.bindingOrders = bindingOrders;
            var produktKennung = _this.bindingOrders[0].produkte[0].Kennung;
            for (var i = 0; i < _this.bindingOrders[0].produkte.length; i++) {
                var row = {
                    produkt: null,
                    produktkennung: "",
                    produktmengen: []
                };
                for (var _i = 0, _a = _this.bindingOrders; _i < _a.length; _i++) {
                    var bindingOrder = _a[_i];
                    for (var _b = 0, _c = bindingOrder.produkte; _b < _c.length; _b++) {
                        var produkt = _c[_b];
                        if (produkt.Kennung === produktKennung) {
                            row.produktkennung = produkt.Kennung;
                            row.produktmengen.push(produkt.Menge);
                        }
                    }
                }
                if (i + 1 !== _this.bindingOrders[0].produkte.length) {
                    produktKennung = _this.bindingOrders[0].produkte[i + 1].Kennung;
                }
                _this.rowtable1.push(row);
            }
            _this.sessionService.setbindingOrders(_this.rowtable1);
            console.log("rt1", _this.rowtable1);
        });
        //TODO: Methoden für Rechnungen umbasteln - ab hier alles unused ATM außer generatePeriods
        this.predictionService.getPlannings()
            .subscribe(function (plannings) {
            _this.plannings = plannings;
            var produktKennung = _this.plannings[0].produkte[0].Kennung;
            for (var i = 0; i < _this.plannings[0].produkte.length; i++) {
                var row2 = {
                    produkt: null,
                    produktkennung: "",
                    produktmengen: []
                };
                for (var _i = 0, _a = _this.plannings; _i < _a.length; _i++) {
                    var p = _a[_i];
                    for (var _b = 0, _c = p.produkte; _b < _c.length; _b++) {
                        var produkt = _c[_b];
                        if (produkt.Kennung === produktKennung) {
                            row2.produktkennung = produkt.Kennung;
                            row2.produktmengen.push(produkt.Menge);
                        }
                    }
                }
                if (i + 1 !== _this.plannings[0].produkte.length) {
                    produktKennung = _this.plannings[0].produkte[i + 1].Kennung;
                }
                _this.rowtable2.push(row2);
            }
            _this.sessionService.setPlannings(_this.rowtable2);
            console.log("rt2", _this.rowtable2);
            // this.generateRowsRemainingStock();
        });
        this.dbService.getResults()
            .subscribe(function (results) {
            _this.results = results;
        });
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