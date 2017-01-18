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
var core_1 = require('@angular/core');
var capacityPlanning_service_1 = require('../../services/capacityPlanning.service');
var session_service_1 = require('../../services/session.service');
var CapacityPlanningComponent = (function () {
    function CapacityPlanningComponent(capacityPlanningService, sessionService) {
        this.capacityPlanningService = capacityPlanningService;
        this.sessionService = sessionService;
        this.artikelListe = new Array();
        this.capacities = new Array();
        this.puffer = new Array();
    }
    CapacityPlanningComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.capacityPlanningService.getWorkstations()
            .subscribe(function (workstations) {
            _this.workstations = workstations;
        });
        this.partOrders = this.sessionService.getPartOrders();
        this.reihenfolgen = this.sessionService.getReihenfolgen();
        this.resultObj = this.sessionService.getResultObject();
        this.getTimesAndEPParts();
    };
    CapacityPlanningComponent.prototype.getTimesAndEPParts = function () {
        var _this = this;
        this.capacityPlanningService.getTimesAndEPParts().subscribe(function (data) {
            _this.processingTimes = data[0];
            _this.parts = data[1];
        }, function (err) { return console.error(err); }, function () { return _this.generateRows(); });
    };
    ;
    CapacityPlanningComponent.prototype.generateRows = function () {
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            var zuweisung = new Array();
            for (var _b = 0, _c = this.processingTimes; _b < _c.length; _b++) {
                var pt = _c[_b];
                var apZeit = [];
                if (pt.teil.nummer === part.nummer) {
                    apZeit.push(pt.arbeitsplatz.nummer);
                    apZeit.push(pt.fertigungsZeit);
                    apZeit.push(pt.ruestZeit);
                    zuweisung.push(apZeit);
                }
            }
            var auftragsMenge = 0;
            for (var partOrder in this.partOrders) {
                var split = partOrder.split("_");
                if (Number.parseInt(split[1]) === part.nummer) {
                    auftragsMenge += Number.parseInt(this.partOrders[partOrder]);
                }
            }
            var prodTime = {
                part: part.nummer,
                zuweisung: zuweisung,
                menge: auftragsMenge
            };
            this.artikelListe.push(prodTime);
        }
        for (var _d = 0, _e = this.artikelListe; _d < _e.length; _d++) {
            var article = _e[_d];
            for (var _f = 0, _g = article.zuweisung; _f < _g.length; _f++) {
                var zw = _g[_f];
                var eingetragen = false;
                for (var _h = 0, _j = this.capacities; _h < _j.length; _h++) {
                    var cap_1 = _j[_h];
                    if (cap_1.workstationNumber === zw[0]) {
                        cap_1.capacity += zw[1] * article.menge;
                        eingetragen = true;
                    }
                }
                if (!eingetragen) {
                    var cap = {
                        workstationNumber: zw[0],
                        capacity: zw[1] * article.menge,
                        leerzeit: 0,
                        ruestzeit: 0,
                        capacityWait: 0,
                        ruestWait: 0,
                        gesamt: 0,
                        schichten: 0,
                        ueberstunden: 0
                    };
                    this.capacities.push(cap);
                }
            }
        }
        //Kapa, Leerzeiten und Rüstzeiten mit Daten aus der Reihenfolge
        for (var _k = 0, _l = this.capacities; _k < _l.length; _k++) {
            var cap_2 = _l[_k];
            for (var _m = 0, _o = this.reihenfolgen; _m < _o.length; _m++) {
                var kap = _o[_m];
                if (cap_2.workstationNumber === kap.workstation.nummer) {
                    if (kap.prioTasks.length > 0) {
                        if ((kap.prioTasks[kap.prioTasks.length - 1].ende - kap.ruestzeit - cap_2.capacity) > 0) {
                            cap_2.leerzeit = kap.prioTasks[kap.prioTasks.length - 1].ende - kap.ruestzeit - cap_2.capacity;
                        }
                    }
                    cap_2.ruestzeit = kap.ruestzeit;
                }
            }
        }
        //Kapa und Rüstzeiten aus den Warteschlangen vor den Arbeitsplätzen
        var warteliste = this.resultObj.results.waitinglistworkstations;
        if (warteliste.workplace) {
            for (var _p = 0, _q = warteliste.workplace; _p < _q.length; _p++) {
                var arbeitsplatz = _q[_p];
                if (arbeitsplatz.waitinglist) {
                    if (arbeitsplatz.waitinglist.length !== undefined) {
                        for (var _r = 0, _s = arbeitsplatz.waitinglist; _r < _s.length; _r++) {
                            var wl = _s[_r];
                            this.setWaitingCapacity(arbeitsplatz, wl, true);
                        }
                    }
                    else {
                        this.setWaitingCapacity(arbeitsplatz, arbeitsplatz.waitinglist, true);
                    }
                }
            }
        }
        //Kapa aus den Aufträgen in Bearbeitung
        var bearbeitung = this.resultObj.results.ordersinwork;
        if (bearbeitung.workplace) {
            for (var _t = 0, _u = bearbeitung.workplace; _t < _u.length; _t++) {
                var arbeitsplatz = _u[_t];
                this.setWaitingCapacity(arbeitsplatz, arbeitsplatz, false);
            }
        }
        //Kapa gesamt + Schichten + Ueberstunden
        for (var _v = 0, _w = this.capacities; _v < _w.length; _v++) {
            var cap_3 = _w[_v];
            cap_3.gesamt = cap_3.capacity + cap_3.leerzeit + cap_3.ruestzeit + cap_3.capacityWait + cap_3.ruestWait;
            this.calcShifts(cap_3);
        }
        this.sessionService.setCapacities(this.capacities);
    };
    CapacityPlanningComponent.prototype.setWaitingCapacity = function (arbeitsplatz, wait, isWaitinglist) {
        for (var _i = 0, _a = this.processingTimes; _i < _a.length; _i++) {
            var pt = _a[_i];
            if (pt.teil.nummer === Number.parseInt(wait.item) && pt.arbeitsplatz.nummer === Number.parseInt(arbeitsplatz.id)) {
                var procTime = pt;
                var weiter = true;
                var firstBearb = true;
                while (weiter) {
                    if (!procTime.nextArbeitsplatz) {
                        weiter = false;
                    }
                    for (var _b = 0, _c = this.capacities; _b < _c.length; _b++) {
                        var cap = _c[_b];
                        if (cap.workstationNumber === procTime.arbeitsplatz.nummer) {
                            if (isWaitinglist) {
                                cap.capacityWait += procTime.fertigungsZeit * Number.parseInt(wait.amount);
                                cap.ruestWait += procTime.ruestZeit;
                            }
                            else {
                                if (firstBearb) {
                                    cap.capacityWait += Number.parseInt(wait.timeneed);
                                    firstBearb = false;
                                }
                                else {
                                    cap.capacityWait += procTime.fertigungsZeit * Number.parseInt(wait.amount);
                                    cap.ruestWait += procTime.ruestZeit;
                                }
                            }
                            break;
                        }
                    }
                    if (weiter) {
                        for (var _d = 0, _e = this.processingTimes; _d < _e.length; _d++) {
                            var pTime = _e[_d];
                            if (pTime.teil.nummer === Number.parseInt(wait.item) && pTime.arbeitsplatz.nummer === procTime.nextArbeitsplatz.nummer) {
                                procTime = pTime;
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
    CapacityPlanningComponent.prototype.calcShifts = function (cap) {
        if (cap.gesamt <= 7200) {
            if (cap.gesamt <= 6000) {
                if (cap.gesamt <= 4800) {
                    if (cap.gesamt <= 3600) {
                        if (cap.gesamt <= 2400) {
                            cap.schichten = 1;
                            cap.ueberstunden = 0;
                        }
                        else {
                            cap.schichten = 1;
                            cap.ueberstunden = Math.ceil((cap.gesamt - 2400) / 5);
                        }
                    }
                    else {
                        cap.schichten = 2;
                        cap.ueberstunden = 0;
                    }
                }
                else {
                    cap.schichten = 2;
                    cap.ueberstunden = Math.ceil((cap.gesamt - 4800) / 5);
                }
            }
            else {
                cap.schichten = 3;
                cap.ueberstunden = 0;
            }
        }
        else {
            cap.schichten = 3;
            cap.ueberstunden = 0;
        }
    };
    CapacityPlanningComponent.prototype.updateShifts = function (workstationNumber) {
        for (var _i = 0, _a = this.capacities; _i < _a.length; _i++) {
            var cap = _a[_i];
            if (cap.workstationNumber === workstationNumber) {
                cap.gesamt = cap.capacity + cap.leerzeit + cap.ruestzeit + cap.capacityWait + cap.ruestWait + this.puffer[workstationNumber];
                this.calcShifts(cap);
                this.sessionService.setCapacities(this.capacities);
                break;
            }
        }
    };
    CapacityPlanningComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'capacityPlanning',
            templateUrl: 'capacityPlanning.component.html'
        }), 
        __metadata('design:paramtypes', [capacityPlanning_service_1.CapacityPlanningService, session_service_1.SessionService])
    ], CapacityPlanningComponent);
    return CapacityPlanningComponent;
}());
exports.CapacityPlanningComponent = CapacityPlanningComponent;
//# sourceMappingURL=capacityPlanning.component.js.map