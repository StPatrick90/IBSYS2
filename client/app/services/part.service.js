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
 * Created by Paddy on 13.11.2016.
 */
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var Rx_1 = require('rxjs/Rx');
var PartService = (function () {
    function PartService(http) {
        this.http = http;
        console.log('Part Service Initialized...');
    }
    PartService.prototype.getParts = function () {
        return this.http.get('api/parts')
            .map(function (res) { return res.json(); });
    };
    PartService.prototype.getWorkstationsAndPartsAndBearbeitung = function () {
        return Rx_1.Observable.forkJoin(this.http.get('/api/workstations').map(function (res) { return res.json(); }), this.http.get('/api/parts').map(function (res) { return res.json(); }), this.http.get('/api/processingTimes').map(function (res) { return res.json(); }));
    };
    PartService.prototype.getProcessingTimes = function () {
        return this.http.get('api/processingTimes')
            .map(function (res) { return res.json(); });
    };
    PartService.prototype.addPart = function (newPart) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/part', JSON.stringify(newPart), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    PartService.prototype.addProcessingTimes = function (newProcessingTimes) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/processingTimes', JSON.stringify(newProcessingTimes), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    PartService.prototype.updatePart = function (part) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/part/' + part._id, JSON.stringify(part), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    PartService.prototype.deleteProcessingTimes = function (ids) {
        return this.http.delete('/api/processingTime/' + ids)
            .map(function (res) { return res.json(); });
    };
    PartService.prototype.deletePart = function (id) {
        return this.http.delete('/api/part/' + id)
            .map(function (res) { return res.json(); });
    };
    PartService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], PartService);
    return PartService;
}());
exports.PartService = PartService;
//# sourceMappingURL=part.service.js.map