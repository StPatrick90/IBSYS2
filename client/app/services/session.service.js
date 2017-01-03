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
        this.dummyObj = {
            results: {
                game: "",
                group: "",
                period: "",
                warehousestock: {
                    article: [{ id: "", amount: "", startamount: "", pct: "", price: "", stockvalue: "" }],
                    totalstockvalue: ""
                },
                inwardstockmovement: {
                    order: [{
                            orderperiod: "",
                            id: "",
                            mode: "",
                            article: "",
                            amount: "",
                            time: "",
                            materialcosts: "",
                            ordercosts: "",
                            entirecosts: "",
                            piececosts: ""
                        }]
                },
                futureinwardstockmovement: {
                    order: [{ orderperiod: "", id: "", mode: "", article: "", amount: "" }]
                },
                idletimecosts: {
                    workplace: [{
                            id: "",
                            setupevents: "",
                            idletime: "",
                            wageidletimecosts: "",
                            wagecosts: "",
                            machineidletimecosts: ""
                        }],
                    sum: { setupevents: "", idletime: "", wageidletimecosts: "", wagecosts: "", machineidletimecosts: "" }
                },
                waitinglistworkstations: {
                    workplace: [{
                            id: "",
                            timeneed: "",
                            waitinglist: {
                                period: "",
                                order: "",
                                firstbatch: "",
                                lastbatch: "",
                                item: "",
                                amount: "",
                                timeneed: ""
                            }
                        }]
                },
                waitingliststock: {
                    missingpart: [{
                            id: "",
                            waitinglist: { period: "", order: "", firstbatch: "", lastbatch: "", item: "", amount: "" }
                        }]
                },
                ordersinwork: {
                    workplace: [{ id: "", period: "", order: "", batch: "", item: "", amount: "", timeneed: "" }]
                },
                completedorders: {
                    order: [{
                            period: "",
                            id: "",
                            item: "",
                            quantity: "",
                            cost: "",
                            averageunitcosts: "",
                            batch: [{ id: "", amount: "", cycletime: "", cost: "" }]
                        }]
                },
                cycletimes: {
                    startedorders: "",
                    waitingorders: "",
                    order: [{ id: "", period: "", starttime: "", finishtime: "", cycletimemin: "", cycletimefactor: "" }]
                },
                result: {
                    general: {
                        capacity: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        possiblecapacity: {
                            current: "",
                            average: "", all: ""
                        },
                        relpossiblenormalcapacity: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        productivetime: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        effiency: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        sellwish: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        salesquantity: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        deliveryreliability: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        idletime: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        idletimecosts: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        storevalue: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        storagecosts: {
                            current: "",
                            average: "",
                            all: ""
                        }
                    },
                    defectivegoods: {
                        quantity: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        costs: {
                            current: "",
                            average: "",
                            all: ""
                        }
                    },
                    normalsale: {
                        salesprice: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        profit: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        profitperunit: {
                            current: "",
                            average: "",
                            all: ""
                        }
                    },
                    directsale: {
                        profit: {
                            current: "",
                            average: "",
                            all: ""
                        },
                        contractpenalty: {
                            current: "",
                            average: "",
                            all: ""
                        }
                    },
                    marketplacesale: {
                        profit: {
                            current: "",
                            average: "",
                            all: ""
                        }
                    },
                    summary: {
                        profit: {
                            current: "",
                            average: "",
                            all: ""
                        }
                    }
                }
            }
        };
        console.log('Session Service Initialized...');
        this.clear();
    }
    SessionService.prototype.getResultObject = function () {
        return (this.resultObj == null || this.resultObj == {}) ? this.dummyObj : JSON.parse(JSON.stringify(this.resultObj));
    };
    SessionService.prototype.setResultObject = function (Obj) {
        this.resultObj = Obj;
    };
    SessionService.prototype.getParts = function () {
        return this.parts;
    };
    SessionService.prototype.setParts = function (parts) {
        this.parts = parts;
    };
    SessionService.prototype.getWorkstations = function () {
        return this.workstations;
    };
    SessionService.prototype.setWorkstations = function (workstations) {
        this.workstations = workstations;
    };
    SessionService.prototype.getProcessingTimes = function () {
        return this.processingTimes;
    };
    SessionService.prototype.setProcessingTimes = function (processingTimes) {
        this.processingTimes = processingTimes;
    };
    SessionService.prototype.setbindingOrders = function (rowtable1) {
        this.bindingorders = rowtable1;
    };
    SessionService.prototype.getbindingOrders = function () {
        return this.bindingorders;
    };
    SessionService.prototype.setPlannings = function (rowtable2) {
        this.plannings = rowtable2;
    };
    SessionService.prototype.getPlannings = function () {
        return this.plannings;
    };
    SessionService.prototype.getPartOrders = function () {
        return this.partOrders;
    };
    SessionService.prototype.setPartOrders = function (partOrders) {
        this.partOrders = partOrders;
    };
    SessionService.prototype.getPlannedWarehouseStock = function () {
        return this.plannedWarehouseStock;
    };
    SessionService.prototype.setPlannedWarehouseStock = function (plannedWarehouseStock) {
        this.plannedWarehouseStock = plannedWarehouseStock;
    };
    SessionService.prototype.clear = function () {
        this.setResultObject(null);
        this.setParts(null);
        this.setWorkstations(null);
        this.setProcessingTimes(null);
        this.setPartOrders(null);
        this.setPlannedWarehouseStock(null);
        this.setPlannings(null);
        this.setbindingOrders(null);
    };
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Object)
    ], SessionService.prototype, "resultObj", void 0);
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Array)
    ], SessionService.prototype, "parts", void 0);
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Array)
    ], SessionService.prototype, "workstations", void 0);
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Array)
    ], SessionService.prototype, "processingTimes", void 0);
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Array)
    ], SessionService.prototype, "partOrders", void 0);
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Array)
    ], SessionService.prototype, "plannedWarehouseStock", void 0);
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Array)
    ], SessionService.prototype, "bindingorders", void 0);
    __decorate([
        WebStorage_1.SessionStorage(), 
        __metadata('design:type', Array)
    ], SessionService.prototype, "plannings", void 0);
    SessionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], SessionService);
    return SessionService;
}());
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map