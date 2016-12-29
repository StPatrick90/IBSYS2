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
 * Created by philipp.koepfer on 10.12.16.
 */
var core_1 = require('@angular/core');
var session_service_1 = require('../../services/session.service');
var part_service_1 = require('../../services/part.service');
var prioTask_1 = require('../../model/prioTask');
var sequence_1 = require('../../model/sequence');
var capacityPlanning_service_1 = require('../../services/capacityPlanning.service');
var PrioComponent = (function () {
    function PrioComponent(sessionService, partService, capacityPlanningService) {
        this.sessionService = sessionService;
        this.partService = partService;
        this.capacityPlanningService = capacityPlanningService;
        this.selector = "";
        this.parts = [];
        this.epParts = [];
        this.pParts = [];
        this.produzierbareAuftraege = [];
        this.nPAuftraege = [];
        this.reihenfolgen = [];
        /*
        {
            workStation: Workstation
        }
         */
        this.processingTimes = [];
        this.zeiten = [];
        this.partOrders = [];
        //TODO: Replace number with part
        /*
        Alternativ Ablauf?
        Schaue bei Endprodukt (z.b. p1) nach ob es genug Material gibt?
        Wenn Ja --> Produzieren
        Wenn Nein --> Endprodukt = Endprodukt.Bestanteil x
         */
        this.defaultAblauf = [18, 13, 7, 19, 14, 8, 20, 15, 9, 49, 10, 4, 54, 11, 5, 29, 12, 6, 50, 17, 16, 55, 30, 51, 26, 56, 31, 1, 2, 3];
    }
    PrioComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.processingTimes = this.sessionService.getProcessingTimes();
        this.resultObj = this.sessionService.getResultObject();
        this.lager = this.resultObj.results.warehousestock.article;
        this.wartelisteMaterial = this.resultObj.results.waitingliststock;
        this.wartelisteArbeitsplatz = this.resultObj.results.waitinglistworkstations;
        this.partService.getParts()
            .subscribe(function (data) {
            _this.parts = data;
            _this.epParts = data.filter(function (item) { return item.typ == "E" || item.typ == "P"; });
            _this.pParts = data.filter(function (item) { return item.typ == "P"; });
        }, function (err) { return console.error(err); }, function () {
            _this.partOrders = _this.sessionService.getPartOrders();
            _this.capacityPlanningService.getWorkstations()
                .subscribe(function (workstations) {
                for (var _i = 0, workstations_1 = workstations; _i < workstations_1.length; _i++) {
                    var workstation = workstations_1[_i];
                    var sequence = new sequence_1.Sequence();
                    sequence.workstation = workstation;
                    sequence.prioTasks = [];
                    _this.reihenfolgen.push(sequence);
                }
                ;
                _this.processOptimizaition();
            });
        });
    };
    PrioComponent.prototype.processOptimizaition = function () {
        for (var _i = 0, _a = this.defaultAblauf; _i < _a.length; _i++) {
            var partNumber = _a[_i];
            var auftragsMenge = 0;
            for (var partOrder in this.partOrders) {
                if (partOrder.includes(partNumber.toString())) {
                    auftragsMenge += Number.parseInt(this.partOrders[partOrder]);
                }
            }
            //Kann was von np abgearbeitet werden?
            for (var idx in this.nPAuftraege) {
                //Schau ob jetzt etwas im Lager ist.
                if ((this.nPAuftraege[idx].Teil.lagerBestand / this.nPAuftraege[idx].anzahl) > 0) {
                    this.nPAuftraege.splice(parseInt(idx), 1);
                    this.processWorkflow(this.nPAuftraege[idx].Teil, this.nPAuftraege[idx].Anzahl);
                }
            }
            console.log(auftragsMenge);
            this.processWorkflow(partNumber, auftragsMenge);
        }
        console.log("reihenfolge:");
        console.log(this.reihenfolgen);
        console.log("pAufträge:");
        console.log(this.produzierbareAuftraege);
        //console.log(this.zeiten);
        console.log(this.lager);
    };
    PrioComponent.prototype.processWorkflow = function (partNumber, auftraege) {
        //Alle Bestandteile des Teils
        var bestandteilArray = this.getPartComponents(partNumber);
        var part = this.getEPPart(partNumber);
        var canBeProduced = true;
        var anzahl = auftraege;
        //Sind Teile da?
        for (var _i = 0, bestandteilArray_1 = bestandteilArray; _i < bestandteilArray_1.length; _i++) {
            var bestandteil = bestandteilArray_1[_i];
            var verfügbar = "";
            if ((bestandteil.lagerBestand / bestandteil.anzahl) > 0) {
                //JA
                if (bestandteil.lagerBestand >= (auftraege * bestandteil.anzahl)) {
                    verfügbar = "ja";
                }
                else {
                    verfügbar = "teilweise";
                }
            }
            else {
                //NEIN
                verfügbar = "nein";
            }
            if (verfügbar === "teilweise") {
                //abrunden
                var produzierbareAuftraege = Math.floor(bestandteil.lagerBestand / bestandteil.anzahl);
                if (produzierbareAuftraege < anzahl)
                    anzahl = produzierbareAuftraege;
            }
            if (verfügbar === "nein") {
                canBeProduced = false;
                break;
            }
        }
        if (canBeProduced === true) {
            if (anzahl === auftraege) {
                var processTime = this.setPartToWorkplace(part, auftraege, bestandteilArray);
                this.produzierbareAuftraege.push({ "Teil": part, "Anzahl": auftraege });
            }
            else {
                //Teilweise
                var processTime = this.setPartToWorkplace(part, anzahl, bestandteilArray);
                this.produzierbareAuftraege.push({ "Teil": part, "Anzahl": anzahl });
                this.nPAuftraege.push({ "Teil": part, "Anzahl": auftraege - anzahl });
            }
        }
        else {
            this.nPAuftraege.push({ "Teil": part, "Anzahl": auftraege });
        }
        var inArray = false;
    };
    PrioComponent.prototype.setPartToWorkplace = function (teil, auftraege, bestandteilArray) {
        // Alle Arbeitsplatz, die das Teil bearbeiten, sortiert -> Array
        var prozessingTime = null;
        var ptx = null;
        for (var _i = 0, _a = this.processingTimes; _i < _a.length; _i++) {
            var pt = _a[_i];
            if ((pt.teil.nummer == teil.nummer) && pt.isStart) {
                //First prozessingTime
                prozessingTime = pt;
                ptx = pt;
                break;
            }
        }
        //TODO: Lagerbestand mit Bestellungen anpassen!
        //TODO: Merge batch objects
        while (auftraege > 0) {
            while (prozessingTime != null) {
                var letzterAuftrag = new prioTask_1.PrioTask();
                letzterAuftrag.ende = 0;
                var neuerAuftrag = new prioTask_1.PrioTask();
                var gleichesTeil = false;
                neuerAuftrag.teil = prozessingTime.teil;
                neuerAuftrag.aktuellerAp = prozessingTime.arbeitsplatz;
                neuerAuftrag.naechsterAp = prozessingTime.nextArbeitsplatz;
                neuerAuftrag.periode = this.resultObj.results.period;
                neuerAuftrag.losgroesse = (auftraege % 10 === 0) ? 10 : (auftraege % 10);
                for (var _b = 0, _c = this.reihenfolgen; _b < _c.length; _b++) {
                    var sequence = _c[_b];
                    if (sequence.workstation.nummer === prozessingTime.arbeitsplatz.nummer) {
                        for (var _d = 0, _e = sequence.prioTasks; _d < _e.length; _d++) {
                            var auftrag = _e[_d];
                            if (letzterAuftrag != null) {
                                if (letzterAuftrag.ende < auftrag.ende) {
                                    if (letzterAuftrag.teil === auftrag.teil) {
                                        gleichesTeil = true;
                                    }
                                    else {
                                        gleichesTeil = false;
                                    }
                                    letzterAuftrag = auftrag;
                                }
                            }
                        }
                    }
                }
                neuerAuftrag.start = letzterAuftrag.ende + 1;
                if (gleichesTeil) {
                    neuerAuftrag.ende = letzterAuftrag.ende + ((auftraege % 10 === 0) ? 10 : (auftraege % 10)) * prozessingTime.fertigungsZeit;
                }
                else {
                    neuerAuftrag.ende = letzterAuftrag.ende + ((auftraege % 10 === 0) ? 10 : (auftraege % 10)) * prozessingTime.fertigungsZeit + prozessingTime.ruestZeit;
                }
                for (var _f = 0, _g = this.reihenfolgen; _f < _g.length; _f++) {
                    var sequence = _g[_f];
                    if (sequence.workstation.nummer === prozessingTime.arbeitsplatz.nummer) {
                        neuerAuftrag._id = sequence.prioTasks.length + 1;
                        sequence.prioTasks.push(neuerAuftrag);
                    }
                }
                //find next prozessingTime
                var processingTimeOld = prozessingTime;
                if (prozessingTime.nextArbeitsplatz) {
                    for (var _h = 0, _j = this.processingTimes; _h < _j.length; _h++) {
                        var pt = _j[_h];
                        if ((pt.teil.nummer == teil.nummer) && (pt.arbeitsplatz.nummer == prozessingTime.nextArbeitsplatz.nummer)) {
                            prozessingTime = pt;
                            break;
                        }
                    }
                }
                if (prozessingTime == processingTimeOld) {
                    prozessingTime = null;
                }
                break;
            }
            var bearbeiteteAuftrage = (auftraege % 10 === 0) ? 10 : (auftraege % 10);
            //Lager anpassen
            for (var idx in this.lager) {
                if (Number.parseInt(this.lager[idx].id) === neuerAuftrag.teil.nummer) {
                    var lagerAmount = Number.parseInt(this.lager[idx].amount);
                    this.lager[idx].amount = (lagerAmount + bearbeiteteAuftrage).toString();
                }
                for (var _k = 0, bestandteilArray_2 = bestandteilArray; _k < bestandteilArray_2.length; _k++) {
                    var bTeil = bestandteilArray_2[_k];
                    if (bTeil.teil.nummer == Number.parseInt(this.lager[idx].id)) {
                        var rechnung = (Number.parseInt(this.lager[idx].amount) - (bearbeiteteAuftrage * bTeil.anzahl));
                        this.lager[idx].amount = rechnung.toString();
                    }
                }
            }
            auftraege -= bearbeiteteAuftrage;
        }
        return ptx;
    };
    PrioComponent.prototype.getEPPart = function (partNumber) {
        for (var _i = 0, _a = this.epParts; _i < _a.length; _i++) {
            var part = _a[_i];
            if (part.nummer === partNumber) {
                return part;
            }
        }
    };
    PrioComponent.prototype.getPartComponents = function (searchPartNumber) {
        var bestandteilArray = [];
        for (var _i = 0, _a = this.epParts; _i < _a.length; _i++) {
            var part = _a[_i];
            if (part.nummer === searchPartNumber) {
                for (var _b = 0, _c = part.bestandteile; _b < _c.length; _b++) {
                    var bestandteil = _c[_b];
                    for (var _d = 0, _e = this.parts; _d < _e.length; _d++) {
                        var pt = _e[_d];
                        if (bestandteil._id === pt._id) {
                            for (var _f = 0, _g = this.lager; _f < _g.length; _f++) {
                                var artikel = _g[_f];
                                if (Number.parseInt(artikel.id) === pt.nummer) {
                                    bestandteilArray.push({ teil: pt, anzahl: bestandteil.anzahl, lagerBestand: Number.parseInt(artikel.amount) });
                                }
                            }
                        }
                    }
                }
            }
        }
        return bestandteilArray;
    };
    PrioComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'prio',
            templateUrl: 'prio.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, part_service_1.PartService, capacityPlanning_service_1.CapacityPlanningService])
    ], PrioComponent);
    return PrioComponent;
}());
exports.PrioComponent = PrioComponent;
/*
 15 Arbeitsplätze

 Max: 9600 min pro Periode
 Eine Schicht mit Überstunden sind 3600 min.

 1. Schicht 2.400 Minuten
 2. Schicht 2.400 Minuten
 3. Schicht 2.400 Minuten
 */ 
//# sourceMappingURL=prio.component.js.map