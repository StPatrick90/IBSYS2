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
var part_1 = require('../../model/part');
var prioTask_1 = require('../../model/prioTask');
var sequence_1 = require('../../model/sequence');
var capacityPlanning_service_1 = require('../../services/capacityPlanning.service');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
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
        this.processingTimes = [];
        this.zeiten = [];
        this.partOrders = [];
        this.defaultAblauf = [];
        this.outPutArray = [];
        this.selectedType = "No";
    }
    PrioComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.defaultAblauf.push(18, 13, 7, 19, 14, 8, 20, 15, 9, 49, 10, 4, 54, 11, 5, 29, 12, 6, 50, 17, 16, 55, 30, 51, 26, 56, 31, 1, 2, 3);
        this.splittingPart = new part_1.Part();
        this.splittingAnzahl2 = 0;
        this.splittingAnzahl = 0;
        this.processingTimes = this.sessionService.getProcessingTimes();
        this.resultObj = this.sessionService.getResultObject();
        this.wartelisteMaterial = this.resultObj.results.waitingliststock;
        this.wartelisteArbeitsplatz = this.resultObj.results.waitinglistworkstations;
        this.partService.getParts()
            .subscribe(function (data) {
            _this.parts = data;
            _this.epParts = data.filter(function (item) { return item.typ == "E" || item.typ == "P"; });
            _this.pParts = data.filter(function (item) { return item.typ == "P"; });
        }, function (err) { return console.error(err); }, function () {
            _this.partOrders = _this.sessionService.getPartOrders();
            console.log(_this.partOrders);
            _this.capacityPlanningService.getWorkstations()
                .subscribe(function (workstations) {
                for (var _i = 0, workstations_1 = workstations; _i < workstations_1.length; _i++) {
                    var workstation = workstations_1[_i];
                    var sequence = new sequence_1.Sequence();
                    sequence.workstation = workstation;
                    sequence.prioTasks = [];
                    sequence.ruestzeit = 0;
                    _this.reihenfolgen.push(sequence);
                }
                ;
            });
        });
    };
    PrioComponent.prototype.onClickJumptron = function (area) {
        this.produzierbareAuftraege.length = 0;
        this.nPAuftraege.length = 0;
        this.outPutArray.length = 0;
        if (area === 'automatic') {
            this.defaultAblauf.length = 0;
            this.defaultAblauf.push(18, 13, 7, 19, 14, 8, 20, 15, 9, 49, 10, 4, 54, 11, 5, 29, 12, 6, 50, 17, 16, 55, 30, 51, 26, 56, 31, 1, 2, 3);
        }
        if (area === 'endProduct') {
            this.defaultAblauf.length = 0;
            var counter = 0;
            for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
                var pPart = _a[_i];
                if (pPart.nummer === 1)
                    if (counter === 0)
                        this.defaultAblauf.push(18, 13, 7, 49, 10, 4, 50, 17, 16, 51, 26, 1);
                    else
                        this.defaultAblauf.push(18, 13, 7, 49, 10, 4, 50, 51, 1);
                if (pPart.nummer === 2)
                    if (counter === 0)
                        this.defaultAblauf.push(19, 14, 8, 54, 11, 5, 55, 17, 16, 56, 26, 2);
                    else
                        this.defaultAblauf.push(19, 14, 8, 54, 11, 5, 55, 56, 2);
                if (pPart.nummer === 3)
                    if (counter === 0)
                        this.defaultAblauf.push(20, 15, 9, 29, 12, 6, 30, 17, 16, 31, 26, 3);
                    else
                        this.defaultAblauf.push(20, 15, 9, 29, 12, 6, 30, 31, 3);
                counter += 1;
            }
        }
        if (area === 'manual') {
            this.defaultAblauf.length = 0;
            for (var _b = 0, _c = this.epParts; _b < _c.length; _b++) {
                var eTeilNummer = _c[_b];
                this.defaultAblauf.push(eTeilNummer.nummer);
            }
        }
        console.log("defautAblauf: ", this.defaultAblauf);
        this.processOptimizaition();
        this.selector = area;
    };
    PrioComponent.prototype.processOptimizaition = function () {
        this.lager = JSON.parse(JSON.stringify(this.resultObj.results.warehousestock.article));
        this.updateStorage();
        for (var _i = 0, _a = this.defaultAblauf; _i < _a.length; _i++) {
            var partNumber = _a[_i];
            var auftragsMenge = 0;
            for (var partOrder in this.partOrders) {
                var split = partOrder.split("_");
                if (Number.parseInt(split[1]) === partNumber) {
                    auftragsMenge += Number.parseInt(this.partOrders[partOrder]);
                }
            }
            //Kann was von np abgearbeitet werden?
            for (var idx in this.nPAuftraege) {
                //Schau ob jetzt etwas im Lager ist.
                if ((this.nPAuftraege[idx].Teil.lagerBestand / this.nPAuftraege[idx].anzahl) > 0) {
                    this.nPAuftraege.splice(parseInt(idx), 1);
                    this.processWorkflow(this.nPAuftraege[idx].Teil, this.nPAuftraege[idx].Anzahl, idx);
                }
            }
            this.processWorkflow(partNumber, auftragsMenge, null);
        }
        console.log("reihenfolge:");
        console.log(this.reihenfolgen);
        console.log("pAufträge:");
        console.log(this.produzierbareAuftraege);
        console.log("npAufträge:");
        console.log(this.nPAuftraege);
        this.outPutArray.length = 0;
        for (var _b = 0, _c = this.produzierbareAuftraege; _b < _c.length; _b++) {
            var auftrag = _c[_b];
            this.outPutArray.push(auftrag);
        }
        for (var _d = 0, _e = this.nPAuftraege; _d < _e.length; _d++) {
            var auftrag = _e[_d];
            this.outPutArray.push(auftrag);
        }
        this.sessionService.setReihenfolgen(this.reihenfolgen);
        this.sessionService.setPrioOutput(this.outPutArray);
    };
    PrioComponent.prototype.processWorkflow = function (partNumber, auftraege, nPAuftragIdx) {
        //Alle Bestandteile des Teils
        var bestandteilArray = this.getPartComponents(partNumber);
        var part = this.getEPPart(partNumber);
        var canBeProduced = true;
        var anzahl = auftraege;
        //Sind Teile da?
        for (var _i = 0, bestandteilArray_1 = bestandteilArray; _i < bestandteilArray_1.length; _i++) {
            var bestandteil = bestandteilArray_1[_i];
            var verfügbar = "";
            if ((bestandteil.lagerBestand / bestandteil.anzahl) > 0 || auftraege === 0) {
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
                if (nPAuftragIdx != null) {
                    this.nPAuftraege[nPAuftragIdx].Anzahl = auftraege - anzahl;
                }
                else {
                    this.nPAuftraege.push({ "Teil": part, "Anzahl": auftraege - anzahl });
                }
            }
        }
        else {
            if (nPAuftragIdx == null)
                this.nPAuftraege.push({ "Teil": part, "Anzahl": auftraege });
        }
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
        // 16  56 11 8 31 6 12 9 20
        while (auftraege > 0) {
            prozessingTime = ptx;
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
                for (var _f = 0, _g = this.reihenfolgen; _f < _g.length; _f++) {
                    var sequence = _g[_f];
                    if (sequence.workstation.nummer === neuerAuftrag.aktuellerAp.nummer) {
                        if (sequence.prioTasks[sequence.prioTasks.length - 1]) {
                            if (sequence.prioTasks[sequence.prioTasks.length - 1].ende > neuerAuftrag.start) {
                                neuerAuftrag.start = sequence.prioTasks[sequence.prioTasks.length - 1].ende + 1;
                            }
                        }
                    }
                }
                if (gleichesTeil) {
                    neuerAuftrag.ende = letzterAuftrag.ende + ((auftraege % 10 === 0) ? 10 : (auftraege % 10)) * prozessingTime.fertigungsZeit;
                }
                else {
                    neuerAuftrag.ende = letzterAuftrag.ende + ((auftraege % 10 === 0) ? 10 : (auftraege % 10)) * prozessingTime.fertigungsZeit + prozessingTime.ruestZeit;
                }
                for (var _h = 0, _j = this.reihenfolgen; _h < _j.length; _h++) {
                    var sequence = _j[_h];
                    if (sequence.workstation.nummer === prozessingTime.arbeitsplatz.nummer) {
                        neuerAuftrag._id = sequence.prioTasks.length + 1;
                        sequence.prioTasks.push(neuerAuftrag);
                        if (!gleichesTeil) {
                            sequence.ruestzeit += prozessingTime.ruestZeit;
                        }
                    }
                }
                //find next prozessingTime
                var processingTimeOld = prozessingTime;
                if (prozessingTime.nextArbeitsplatz) {
                    for (var _k = 0, _l = this.processingTimes; _k < _l.length; _k++) {
                        var pt = _l[_k];
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
                for (var _m = 0, bestandteilArray_2 = bestandteilArray; _m < bestandteilArray_2.length; _m++) {
                    var bTeil = bestandteilArray_2[_m];
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
                                    console.log(pt.nummer, Number.parseInt(artikel.amount));
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
    PrioComponent.prototype.updateStorage = function () {
        for (var idx in this.lager) {
            if (this.wartelisteMaterial.missingpart) {
                if (this.wartelisteMaterial.missingpart.length > 0) {
                    for (var _i = 0, _a = this.wartelisteMaterial.missingpart; _i < _a.length; _i++) {
                        var material = _a[_i];
                        if (material.waitinglist.item == this.lager[idx].id) {
                            if (material.waitinglist.period == this.resultObj.results.period) {
                                var lagerMenge = Number.parseInt(this.lager[idx].amount);
                                var bestellMenge = Number.parseInt(material.waitinglist.amount);
                                this.lager[idx].amount = (lagerMenge + bestellMenge).toString();
                            }
                        }
                    }
                }
                else {
                    if (this.wartelisteMaterial.missingpart.waitinglist.item == this.lager[idx].id) {
                        if (this.wartelisteMaterial.missingpart.waitinglist.period == this.resultObj.results.period) {
                            var lagerMenge = Number.parseInt(this.lager[idx].amount);
                            var bestellMenge = Number.parseInt(this.wartelisteMaterial.missingpart.waitinglist.amount);
                            this.lager[idx].amount = (lagerMenge + bestellMenge).toString();
                            break;
                        }
                        break;
                    }
                }
            }
        }
    };
    PrioComponent.prototype.reloadProcess = function () {
        if (this.selectedType === 'Yes') {
            if (this.selector === 'endProduct') {
                this.onClickJumptron('endProduct');
                return;
            }
            this.nPAuftraege.length = 0;
            this.outPutArray.length = 0;
            this.defaultAblauf.length = 0;
            for (var _i = 0, _a = this.produzierbareAuftraege; _i < _a.length; _i++) {
                var pAuftrag = _a[_i];
                var nr = pAuftrag.Teil.nummer;
                var isInArray = false;
                for (var _b = 0, _c = this.defaultAblauf; _b < _c.length; _b++) {
                    var defNr = _c[_b];
                    if (nr === defNr) {
                        isInArray = true;
                    }
                }
                if (!isInArray)
                    this.defaultAblauf.push(nr);
            }
            this.produzierbareAuftraege.length = 0;
            this.processOptimizaition();
        }
    };
    //Splitting
    PrioComponent.prototype.setModalView = function (object, index) {
        this.splittingAnzahl2 = object.Anzahl;
        this.splittingPart = object.Teil;
        this.splittingAnzahl = object.Anzahl / 2;
        this.modalSplitting.open();
    };
    PrioComponent.prototype.closeModalView = function () {
        this.modalSplitting.close();
    };
    PrioComponent.prototype.saveModalView = function () {
        if (this.splittingAnzahl > 0) {
            for (var idx in this.produzierbareAuftraege) {
                if (this.produzierbareAuftraege[idx].Teil === this.splittingPart) {
                    if ((this.produzierbareAuftraege[idx].Anzahl - this.splittingAnzahl) > 0) {
                        this.produzierbareAuftraege[idx].Anzahl -= this.splittingAnzahl;
                        this.produzierbareAuftraege.splice(Number.parseInt(idx), 0, { "Teil": this.splittingPart, "Anzahl": this.splittingAnzahl });
                    }
                    break;
                }
            }
        }
        this.modalSplitting.close();
    };
    PrioComponent.prototype.clickRadio = function (type) {
        this.selectedType = type;
    };
    PrioComponent.prototype.isSelected = function (type) {
        if (type === this.selectedType) {
            return true;
        }
        return false;
    };
    __decorate([
        core_1.ViewChild('splitting'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], PrioComponent.prototype, "modalSplitting", void 0);
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