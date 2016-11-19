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
var PredictionComponent = (function () {
    function PredictionComponent(sessionService) {
        this.periods = [];
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
    }
    PredictionComponent.prototype.generatePeriods = function (index) {
        this.period = parseInt(this.resultObjs.results.period, 10);
        this.periods.push(this.period);
        this.periods.push(this.period + 1);
        this.periods.push(this.period + 2);
        this.periods.push(this.period + 3);
        return this.periods[index];
    };
    PredictionComponent.prototype.generateArray = function (obj) {
        return Object.keys(obj).map(function (key) { return obj[key]; });
    };
    PredictionComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'prediction',
            templateUrl: 'prediction.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService])
    ], PredictionComponent);
    return PredictionComponent;
}());
exports.PredictionComponent = PredictionComponent;
//# sourceMappingURL=prediction.component.js.map