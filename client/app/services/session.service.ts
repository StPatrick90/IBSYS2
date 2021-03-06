/**
 * Created by Paddy on 21.10.2016.
 */
import {Injectable} from '@angular/core';
import {SessionStorage} from "angular2-localstorage/WebStorage";
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {Part} from '../model/part';
import {Workstation} from '../model/workstastion';
import {ProcessingTime} from '../model/processingTime';
import {rowtype} from "../model/rowtype";
import {matPlanRow} from "../model/matPlanRow";
import {Forecast} from "../model/forecast";
import {Sequence} from "../model/sequence";
import {Capacity} from "../model/capacity";


@Injectable()
export class SessionService {

    @SessionStorage() private resultObj;
    @SessionStorage() private parts: Part[];
    @SessionStorage() private workstations: Workstation[];
    @SessionStorage() private processingTimes: ProcessingTime[];
    @SessionStorage() private partOrders: Array<any>;
    @SessionStorage() private plannedWarehouseStock: Array<any>;
    @SessionStorage() private bindingorders: rowtype[];
    @SessionStorage() private plannings: rowtype[];
    @SessionStorage() private matPlan: matPlanRow[];
    @SessionStorage() private verwendungRow: string[];
    @SessionStorage() private periodRow: number[];
    @SessionStorage() private forecast: Forecast;
    @SessionStorage() private actualPeriod: number;
    @SessionStorage() private reihenfolgen: Array<Sequence> = [];
    @SessionStorage() private prioOutput: Array<any> = []; // Teil und Anzahl
    @SessionStorage() private capacities: Array<Capacity> = [];
    @SessionStorage() private _fromothercomp: boolean;

    constructor(private http: Http) {
        console.log('Session Service Initialized...');
        this.clear();
    }

    public dummyObj = {
        results: {
            game: "",
            group: "",
            period: "",
            warehousestock: {
                article: [{id: "", amount: "", startamount: "", pct: "", price: "", stockvalue: ""}],
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
                order: [{orderperiod: "", id: "", mode: "", article: "", amount: ""}]
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
                sum: {setupevents: "", idletime: "", wageidletimecosts: "", wagecosts: "", machineidletimecosts: ""}
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
                    waitinglist: {period: "", order: "", firstbatch: "", lastbatch: "", item: "", amount: ""}
                }]
            },

            ordersinwork: {
                workplace: [{id: "", period: "", order: "", batch: "", item: "", amount: "", timeneed: ""}]
            },

            completedorders: {
                order: [{
                    period: "",
                    id: "",
                    item: "",
                    quantity: "",
                    cost: "",
                    averageunitcosts: "",
                    batch: [{id: "", amount: "", cycletime: "", cost: ""}]
                }]
            },

            cycletimes: {
                startedorders: "",
                waitingorders: "",
                order: [{id: "", period: "", starttime: "", finishtime: "", cycletimemin: "", cycletimefactor: ""}]
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

    getResultObject() {
        return (this.resultObj == null || this.resultObj == {}) ? this.dummyObj : JSON.parse(JSON.stringify(this.resultObj));
    }

    setResultObject(Obj) {
        this.resultObj = Obj;
    }

    getParts() {
        return JSON.parse(JSON.stringify(this.parts));
    }

    setParts(parts) {
        this.parts = parts;
    }

    getWorkstations() {
        return JSON.parse(JSON.stringify(this.workstations));
    }

    setWorkstations(workstations) {
        this.workstations = workstations;
    }

    getProcessingTimes() {
        return JSON.parse(JSON.stringify(this.processingTimes));
    }

    setProcessingTimes(processingTimes) {
        this.processingTimes = processingTimes;
    }

    setbindingOrders(rowtable1) {
        this.bindingorders = rowtable1;
    }

    getbindingOrders() {
        return JSON.parse(JSON.stringify(this.bindingorders));
    }

    setPlannings(rowtable2) {
        this.plannings = rowtable2;
    }

    getPlannings() {
        return JSON.parse(JSON.stringify(this.plannings));
    }

    getPartOrders() {
        return this.partOrders;
    }

    setPartOrders(partOrders) {
        this.partOrders = partOrders;
    }

    getPlannedWarehouseStock() {
        return this.plannedWarehouseStock;
    }

    setPlannedWarehouseStock(plannedWarehouseStock) {
        this.plannedWarehouseStock = plannedWarehouseStock;
    }

    getMatPlan() {
        return this.matPlan;
    }

    setMatPlan(matPlan) {
        this.matPlan = matPlan;
    }

    getVerwendungRow() {
        return this.verwendungRow;
    }

    setVerwendungRow(verwendungRow: string[]) {
        this.verwendungRow = verwendungRow;
    }

    getPeriodRow() {
        return this.periodRow;
    }

    setPeriodRow(periodRow: number[]) {
        this.periodRow = periodRow;
    }

    getForecast() {
        return this.forecast;
    }

    setForecast(forecast) {
        this.forecast = forecast;
        this.matPlan = null;
    }

    setActualPeriod(period) {
        this.actualPeriod = period;
    }

    getActualPeriod() {
        return this.actualPeriod;
    }

    setReihenfolgen(reihenfolgen) {
        this.reihenfolgen = reihenfolgen;
    }

    getReihenfolgen() {
        return this.reihenfolgen;
    }

    setPrioOutput(prioOutput) {
        this.prioOutput = prioOutput;
    }

    getPrioOutput() {
        return this.prioOutput;
    }

    setCapacities(capacities) {
        this.capacities = capacities;
    }

    getCapacities() {
        return this.capacities;
    }

    getfromothercomp(): boolean {
        return this._fromothercomp;
    }

    setfromothercomp(value: boolean) {
        this._fromothercomp = value;
    }

    clear() {
        this.setResultObject(null);
        this.setParts(null);
        this.setWorkstations(null);
        this.setProcessingTimes(null);
        this.setPartOrders(null);
        this.setPlannedWarehouseStock(null);
        this.setPlannings(null);
        this.setbindingOrders(null);
        this.setMatPlan(null);
        this.setActualPeriod(null);
        this.setForecast(null);
        this.setCapacities(null);
        this.setfromothercomp(null);
    }

}
