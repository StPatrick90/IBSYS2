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
/**
 * Created by Paddy on 03.11.2016.
 */
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
var Rx_1 = require("rxjs/Rx");
var CapacityPlanningService = (function () {
    function CapacityPlanningService(http) {
        this.http = http;
        console.log('CapacityPlanning Service Initialized...');
    }
    CapacityPlanningService.prototype.getWorkstations = function () {
        return this.http.get('api/workstations')
            .map(function (res) { return res.json(); });
    };
    /*
    getProcessingTimes(){
        return this.http.get('api/processingTimes')
            .map(res => res.json());
    }
    get_EP_Parts(){
        return this.http.get('api/epparts')
            .map(res => res.json());
    }
    */
    CapacityPlanningService.prototype.getTimesAndEPParts = function () {
        return Rx_1.Observable.forkJoin(this.http.get('/api/processingTimes').map(function (res) { return res.json(); }), this.http.get('/api/epparts').map(function (res) { return res.json(); }));
    };
    return CapacityPlanningService;
}());
CapacityPlanningService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], CapacityPlanningService);
exports.CapacityPlanningService = CapacityPlanningService;
//# sourceMappingURL=capacityPlanning.service.js.map