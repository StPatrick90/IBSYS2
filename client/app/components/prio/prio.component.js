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
var core_1 = require("@angular/core");
var session_service_1 = require("../../services/session.service");
var part_service_1 = require("../../services/part.service");
var PrioComponent = (function () {
    function PrioComponent(sessionService, partService) {
        this.sessionService = sessionService;
        this.partService = partService;
        this.selector = "";
        this.parts = [];
        this.epParts = [];
        this.pParts = [];
        this.produzierbareAuftraege = [];
        this.nPAuftraege = [];
        this.reihenfolgen = [];
        this.processingTimes = [];
        this.zeiten = [];
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
        }, function (err) { return console.error(err); }, function () { return _this.processOptimization(); });
    };
    PrioComponent.prototype.processOptimization = function () {
        for (var _i = 0, _a = this.defaultAblauf; _i < _a.length; _i++) {
            var teil = _a[_i];
            var bestandteilArray = this.getPartCapacities(teil);
            //console.log(bestandteilArray);
            //Kann was von np abgearbeitet werden?
            var mockAuftragProTeil = 40;
            //Sind Teile da?
            for (var _b = 0, bestandteilArray_1 = bestandteilArray; _b < bestandteilArray_1.length; _b++) {
                var bestandteil = bestandteilArray_1[_b];
                var verfuegbar = "";
                if (bestandteil.lagerBestand > 0) {
                    //JA
                    if (bestandteil.lagerBestand >= (mockAuftragProTeil * bestandteil.lagerBestand.anzahl)) {
                    }
                    else {
                    }
                }
                else {
                }
            }
            //Wenn ja dann suche dir den ersten Prozessschritt zu Teil nr. x
            //Welcher Arbeitsplatz?
            //Wann ist Zeit und wieviel?
            //Füge ganz hinzu, teilweise oder garnicht! -> npListe
            //Suche nächsten Arbeitsplatz Repeat ab Zeile 70;
            var inArray = false;
        }
        //console.log(this.zeiten);
    };
    PrioComponent.prototype.getFreeCapacitieforWorkstation = function (workstation) {
    };
    PrioComponent.prototype.getPartCapacities = function (searchPart) {
        var bestandteilArray = [];
        for (var _i = 0, _a = this.epParts; _i < _a.length; _i++) {
            var part = _a[_i];
            if (part.nummer === searchPart) {
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
    return PrioComponent;
}());
PrioComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'prio',
        templateUrl: 'prio.component.html'
    }),
    __metadata("design:paramtypes", [session_service_1.SessionService, part_service_1.PartService])
], PrioComponent);
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