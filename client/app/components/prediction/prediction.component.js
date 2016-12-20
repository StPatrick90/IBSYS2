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
        this._produkt = null;
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
        this.bindingOrders = new Array();
        this.plannings = new Array();
        this.bindingtable = new Array();
        this.rowtable = new Array();
    }
    PredictionComponent.prototype.ngOnInit = function () {
        var _this = this;
        var row = {
            produkt: null,
            produktkennung: "",
            produktmengen: [],
            perioden: []
        };
        this.predictionService.getBindingOrders()
            .subscribe(function (bindingOrders) {
            _this.bindingOrders = bindingOrders;
            for (var i = 0; i < _this.bindingOrders.length; i++) {
                row.produktkennung = _this.bindingOrders[i].produkte[i].Kennung;
                for (var k = 0; k < _this.bindingOrders.length; k++) {
                    for (var _i = 0, _a = _this.bindingOrders[k].produkte; _i < _a.length; _i++) {
                        var b = _a[_i];
                        console.log(b.Kennung);
                        console.log(b.Menge);
                        if (b.Kennung == row.produktkennung) {
                            row.produktmengen.push(b.Menge);
                        }
                    }
                }
                _this.rowtable.push(row);
                console.log(row);
            }
            //row.perioden.push(this.bindingOrders[i].period);
        });
        //console.log(this.rowtable);
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