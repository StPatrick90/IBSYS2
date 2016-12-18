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
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var PredictionService = (function () {
    function PredictionService(http) {
        this.http = http;
        console.log('Prediction Service Initialized...');
    }
    PredictionService.prototype.getBindingOrders = function () {
        return this.http.get('api/bindingOrders')
            .map(function (res) { return res.json(); });
    };
    PredictionService.prototype.getPlannings = function () {
        return this.http.get('api/plannings')
            .map(function (res) { return res.json(); });
    };
    return PredictionService;
}());
PredictionService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], PredictionService);
exports.PredictionService = PredictionService;
//# sourceMappingURL=prediction.service.js.map