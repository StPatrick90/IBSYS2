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
 * Created by Paddy on 21.10.2016.
 */
var core_1 = require('@angular/core');
var WebStorage_1 = require("angular2-localstorage/WebStorage");
var http_1 = require('@angular/http');
require('rxjs/add/operator/map');
var SessionService = (function () {
    function SessionService(http) {
        this.http = http;
        this.dummyObj = { results: {
                game: "",
                group: "",
                period: "",
                warehousestock: {
                    article: [{ id: "", amount: "", startamount: "", pct: "", price: "", stockvalue: "" }],
                    totalstockvalue: "" },
                inwardstockmovement: {
                    order: [{ orderperiod: "", id: "", mode: "", article: "", amount: "", time: "", materialcosts: "", ordercosts: "", entirecosts: "", piececosts: "" }] },
                futureinwardstockmovement: {
                    order: [{ orderperiod: "", id: "", mode: "", article: "", amount: "" }] },
                idletimecosts: {
                    workplace: [{ id: "", setupevents: "", idletime: "", wageidletimecosts: "", wagecosts: "", machineidletimecosts: "" }],
                    sum: { setupevents: "", idletime: "", wageidletimecosts: "", wagecosts: "", machineidletimecosts: "" } },
                waitinglistworkstations: {
                    workplace: [{ id: "", timeneed: "", waitinglist: { period: "", order: "", firstbatch: "", lastbatch: "", item: "", amount: "", timeneed: "" } }] },
                waitingliststock: {
                    missingpart: [{ id: "", waitinglist: { period: "", order: "", firstbatch: "", lastbatch: "", item: "", amount: "" } }] },
                ordersinwork: {
                    workplace: [{ id: "", period: "", order: "", batch: "", item: "", amount: "", timeneed: "" }] },
                completedorders: {
                    order: [{ period: "", id: "", item: "", quantity: "", cost: "", averageunitcosts: "", batch: [{ id: "", amount: "", cycletime: "", cost: "" }] }] },
                cycletimes: {
                    startedorders: "",
                    waitingorders: "",
                    order: [{ id: "", period: "", starttime: "", finishtime: "", cycletimemin: "", cycletimefactor: "" }] },
                result: {
                    general: {
                        capacity: {
                            current: "",
                            average: "",
                            all: "" },
                        possiblecapacity: {
                            current: "",
                            average: "", all: "" },
                        relpossiblenormalcapacity: {
                            current: "",
                            average: "",
                            all: "" },
                        productivetime: {
                            current: "",
                            average: "",
                            all: "" },
                        effiency: {
                            current: "",
                            average: "",
                            all: "" },
                        sellwish: {
                            current: "",
                            average: "",
                            all: "" },
                        salesquantity: {
                            current: "",
                            average: "",
                            all: "" },
                        deliveryreliability: {
                            current: "",
                            average: "",
                            all: "" },
                        idletime: {
                            current: "",
                            average: "",
                            all: "" },
                        idletimecosts: {
                            current: "",
                            average: "",
                            all: "" },
                        storevalue: {
                            current: "",
                            average: "",
                            all: "" },
                        storagecosts: {
                            current: "",
                            average: "",
                            all: "" } },
                    defectivegoods: {
                        quantity: {
                            current: "",
                            average: "",
                            all: "" },
                        costs: {
                            current: "",
                            average: "",
                            all: "" } },
                    normalsale: {
                        salesprice: {
                            current: "",
                            average: "",
                            all: "" },
                        profit: {
                            current: "",
                            average: "",
                            all: "" },
                        profitperunit: {
                            current: "",
                            average: "",
                            all: "" } },
                    directsale: {
                        profit: {
                            current: "",
                            average: "",
                            all: "" },
                        contractpenalty: {
                            current: "",
                            average: "",
                            all: "" } },
                    marketplacesale: {
                        profit: {
                            current: "",
                            average: "",
                            all: "" } },
                    summary: {
                        profit: {
                            current: "",
                            average: "",
                            all: "" } } } } };
        console.log('Session Service Initialized...');
    }
    SessionService.prototype.getResultObject = function () {
        return (this.resultObj == null || this.resultObj == {}) ? this.dummyObj : this.resultObj;
    };
    SessionService.prototype.setResultObject = function (Obj) {
        this.resultObj = Obj;
        this.addResults(Obj)
            .subscribe(function (result) { return result; });
    };
    /*
        //DB save
        this.addResults(Obj)
    .subscribe(task => {
        console.log("yooooo");
        console.log(task);
    })*/
    SessionService.prototype.addResults = function (result) {
        var headers = new http_1.Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/result', JSON.stringify(result), { headers: headers })
            .map(function (res) { return res.json(); });
    };
    SessionService.prototype.getResult = function () {
        return this.http.get('/api/results')
            .map(function (res) { return res.json(); });
    };
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Object)
    ], SessionService.prototype, "resultObj", void 0);
    SessionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SessionService);
    return SessionService;
}());
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map