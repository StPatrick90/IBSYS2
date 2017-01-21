import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {MaterialPlanningService} from '../../services/materialPlanning.service';
import {Part} from '../../model/part';
import {matPlanRow} from "../../model/matPlanRow";
import sort = require("core-js/fn/array/sort");
import {Http} from "@angular/http";
import {rowtype} from "../../model/rowtype";
import {vorigeBestellung} from "../../model/vorigeBestellung";

@Component({
    moduleId: module.id,
    selector: 'materialPlanning',
    templateUrl: 'materialPlanning.component.html'
})
export class MaterialPlanningComponent {

    resultObj: any;
    purchaseParts: Part[];
    matPlan: matPlanRow[];
    verwendungRow: string[];
    periodrow: number[];
    plannings: rowtype[];
    planning: rowtype;
    bestellarten: string[];
    vorigeBestellungen: vorigeBestellung[];
    changed: boolean;
    doonce: number;
    urmenge: number;
    urbestand: number[]
    differenz: number;
    indexsave: number;
    noperiod: boolean;

    constructor(private sessionService: SessionService, private  materialPlanningService: MaterialPlanningService, private http: Http) {
        this.resultObj = this.sessionService.getResultObject();
        this.matPlan = new Array<matPlanRow>();
        this.verwendungRow = new Array<string>();
        this.periodrow = new Array<number>();
        this.plannings = new Array<rowtype>();
        this.planning = new rowtype();
        this.getKParts();
        this.bestellarten = new Array<string>("E.", "N.", "---");
        this.vorigeBestellungen = new Array<vorigeBestellung>();
        this.changed = false;
        this.doonce = 1;
        this.urmenge = 0;
        this.urbestand = new Array<number>();
        this.differenz = 0;
        this.noperiod = false;
        this.indexsave = 0;
    }

    getKParts() {
        this.materialPlanningService.getKParts()
            .subscribe(data => {
                    this.purchaseParts = data
                },
                err => console.error(err),

                () => this.setParameters())
    };

    setvorigeBestellungen() { // 5 ist normal, 4 ist eil !!eil ist ohne abweichung die hälfte
        for (var i = 0; i < this.resultObj.results.inwardstockmovement.order.length; i++) {
            var vorigeBestellung = {
                teil: null,
                menge: null,
                orderperiode: null,
                ankunftperiode: null,
                mode: null
            }

            vorigeBestellung.menge = this.resultObj.results.inwardstockmovement.order[i].amount;
            vorigeBestellung.orderperiode = this.resultObj.results.inwardstockmovement.order[i].orderperiod;
            vorigeBestellung.teil = this.resultObj.results.inwardstockmovement.order[i].article;
            vorigeBestellung.mode = this.resultObj.results.inwardstockmovement.order[i].mode;

            for (let p of this.purchaseParts) {
                var ankunftperiode: number;
                if (p.nummer == vorigeBestellung.teil) {

                    // Eil oder Normalbestellung
                    if (vorigeBestellung.mode == 4) {
                        ankunftperiode = p.lieferfrist + Number(vorigeBestellung.orderperiode);
                    }
                    else {
                        ankunftperiode = p.lieferfrist + p.abweichung + Number(vorigeBestellung.orderperiode);
                    }

                    // bei größer 0,6 runde auf, sonst runde ab
                    ankunftperiode = this.roundAt0point6(ankunftperiode);

                    vorigeBestellung.ankunftperiode = ankunftperiode
                    this.vorigeBestellungen.push(vorigeBestellung);
                }
            }
        }
    }

    setParameters() {
        if (this.sessionService.getMatPlan() == null || this.sessionService.getActualPeriod() != Number(this.resultObj.results.period)) {
            this.sessionService.setfromothercomp(true);
            this.matPlan = new Array<matPlanRow>();
            var aktuellePeriode = this.resultObj.results.period;
            this.getBruttoBedarfandPeriods();
            this.setvorigeBestellungen();

            var index = 0;
            for (let purchPart of this.purchaseParts) {
                var matPlanRow = {
                    kpartnr: null,
                    lieferfrist: null,
                    abweichung: null,
                    summe: null,
                    verwendung: [],
                    diskontmenge: null,
                    anfangsbestand: null,
                    bruttobedarfnP: [],
                    mengeohbest: null,
                    bestellmenge: null,
                    mengemitbest: null,
                    bestellung: null,
                    bestandnWe: [],
                    isneg: null,
                    isneg2: null
                }

                // collect values
                matPlanRow.kpartnr = purchPart.nummer;
                index = matPlanRow.kpartnr as number - 1;
                matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[index].amount;
                matPlanRow.abweichung = purchPart.abweichung;
                matPlanRow.lieferfrist = purchPart.lieferfrist;
                matPlanRow.diskontmenge = purchPart.diskontmenge;
                matPlanRow.summe = Number((matPlanRow.lieferfrist + matPlanRow.abweichung).toFixed(2));

                // get Verwendungen
                for (let vw of purchPart.verwendung) {
                    matPlanRow.verwendung.push(vw);
                }

                // get Bruttobedarf --- hier auch einfach new Array(länge) machen ?
                matPlanRow.bruttobedarfnP.push(0);
                for (let p of this.plannings) {
                    while (matPlanRow.bruttobedarfnP.length < p.produktmengen.length) {
                        matPlanRow.bruttobedarfnP.push(0);
                    }
                }
                // matPlanRow.bruttobedarfnP = new Array<number>(4);
                for (let vw of purchPart.verwendung) {
                    for (let p of this.plannings) {
                        if (vw.Produkt === p.produktkennung) {
                            for (var i = 0; i < matPlanRow.bruttobedarfnP.length; i++) {
                                matPlanRow.bruttobedarfnP[i] += vw.Menge * p.produktmengen[i];
                            }
                        }
                    }
                }
                // get Menge ohne Bestellung
                matPlanRow.mengeohbest = matPlanRow.anfangsbestand;
                for (var i = 0; i < matPlanRow.bruttobedarfnP.length; i++) {
                    matPlanRow.mengeohbest = matPlanRow.mengeohbest - matPlanRow.bruttobedarfnP[i];
                    matPlanRow.mengemitbest = matPlanRow.mengeohbest;
                }
                if (matPlanRow.mengeohbest < 0) {
                    matPlanRow.isneg = true;
                }
                else {
                    matPlanRow.isneg = false;
                }

                // get Menge mit Bestellung aus Vorperiode
                for (let vb of this.vorigeBestellungen) {
                    if (matPlanRow.kpartnr == vb.teil) {
                        if (vb.ankunftperiode <= aktuellePeriode) {
                            matPlanRow.mengemitbest = Number(vb.menge) + matPlanRow.mengeohbest;
                        }
                    }
                }
                if (matPlanRow.mengemitbest < 0) {
                    matPlanRow.isneg2 = true;
                }
                else {
                    matPlanRow.isneg2 = false;
                }

                // set Bestand n. Wareneingang
                matPlanRow.bestandnWe = new Array<number>(4);
                for (var i = 0; i < matPlanRow.bestandnWe.length; i++) {
                    if (i === 0) {
                        matPlanRow.bestandnWe[i] = matPlanRow.anfangsbestand - matPlanRow.bruttobedarfnP[i];
                    }
                    else {
                        matPlanRow.bestandnWe[i] = matPlanRow.bestandnWe[i - 1] - matPlanRow.bruttobedarfnP[i];
                    }
                }
                for (let vb of this.vorigeBestellungen) {
                    for (var i2 = 0; i2 < matPlanRow.bestandnWe.length; i2++) {
                        if (matPlanRow.kpartnr == vb.teil && vb.ankunftperiode == Number(this.resultObj.results.period) + i2) {
                            matPlanRow.bestandnWe[i2] += Number(vb.menge);
                        }
                    }
                }

                // set Bestellmenge (Bestand n gepl.WE zeigt Bestand am ENDE einer Periode)
                matPlanRow.bestellmenge = 0;
                matPlanRow.bestellung = "---";
                var bereitseilbestellt: boolean = false;
                var max_relperiod_ind: number = 0;
                var vorigemengen: number = 0;

                max_relperiod_ind = this.roundAt0point6(matPlanRow.summe);

                for (var i = 0; i <= max_relperiod_ind; i++) {
                    vorigemengen += matPlanRow.bestandnWe[i];
                }

                for (var i = 0; i <= max_relperiod_ind; i++) {
                    if ((matPlanRow.bestandnWe[i] + matPlanRow.mengemitbest + vorigemengen) < 0) {

                        if (i < max_relperiod_ind) { // Eilbestellung wenn Bestellung erst ankommen würde wenn Bestand schon leer ist oder hier +1 ?
                            matPlanRow.bestellmenge = matPlanRow.bestandnWe[i] * -1 + matPlanRow.mengemitbest * -1;
                            matPlanRow.bestellung = "E.";

                            // diskont aufrechnen, wenn nur 20% fehlen würden
                            if (matPlanRow.bestellmenge > 0.8 * matPlanRow.diskontmenge && matPlanRow.bestellmenge <= matPlanRow.diskontmenge) {
                                matPlanRow.bestellmenge = matPlanRow.diskontmenge;
                            }

                            bereitseilbestellt = true;
                        }
                        else if (bereitseilbestellt) {
                            matPlanRow.bestellmenge += matPlanRow.bestandnWe[i] * -1;
                            matPlanRow.bestellung = "E.";
                        }
                        else { // Normalbestellung, aber so spät wie möglich
                            matPlanRow.bestellmenge = matPlanRow.bestandnWe[i] * -1 + matPlanRow.mengemitbest * -1;
                            matPlanRow.bestellung = "N.";

                            // diskont aufrechnen,  wenn nur 20% fehlen würden
                            if (matPlanRow.bestellmenge > 0.8 * matPlanRow.diskontmenge && matPlanRow.bestellmenge <= matPlanRow.diskontmenge) {
                                matPlanRow.bestellmenge = matPlanRow.diskontmenge;
                            }
                        }
                    }
                }

                // Bestand + Bestellmenge
                if (matPlanRow.bestellung === "E.") {
                    max_relperiod_ind = this.roundAt0point6((matPlanRow.lieferfrist / 2));
                }
                else {
                    max_relperiod_ind = this.roundAt0point6(matPlanRow.summe);
                }

                for (var x = 0; x < matPlanRow.bestandnWe.length; x++) {
                    if (x >= max_relperiod_ind && matPlanRow.bestellmenge != 0) {
                        matPlanRow.bestandnWe[x] = matPlanRow.bestandnWe[x] + Number(matPlanRow.bestellmenge);
                    }
                }

                // get Verwendungsarten
                for (var l = 0; l <= matPlanRow.verwendung.length - 1; l++) {
                    if (!this.verwendungRow.includes(matPlanRow.verwendung[l].Produkt)) {
                        this.verwendungRow.push(matPlanRow.verwendung[l].Produkt);
                    }
                }

                // store values finally
                this.matPlan.push(matPlanRow);
            }

            if (!this.noperiod) {
                this.sessionService.setVerwendungRow(this.verwendungRow);
                this.sessionService.setPeriodRow(this.periodrow);
                this.sessionService.setMatPlan(this.matPlan);
                this.sessionService.setActualPeriod(Number(this.resultObj.results.period));
                this.setLayout();
            }
            else {
                this.sessionService.setMatPlan(null);
                this.sessionService.setPeriodRow(null);
                this.sessionService.setVerwendungRow(null);
            }
        }

        else {
            console.log("Kaufteildispo bereits in Session eingebunden. - nach Änderungen auf der Datenbank bitte neue Session starten");
            this.periodrow = this.sessionService.getPeriodRow();
            this.verwendungRow = this.sessionService.getVerwendungRow();
            this.matPlan = this.sessionService.getMatPlan();
            this.setLayout();
        }
    }

    roundAt0point6(zahl: number) {
        if (zahl % 1 >= 0.6) {
            zahl = Math.ceil(zahl);
        }
        else {
            zahl = Math.floor(zahl);
        }
        return zahl;
    }

    bestellmengechange(event, index) {
        this.doonce++;
        if (this.doonce % 2 == 0) {

            if (this.matPlan[index].bestellung === "E.") {
                var max_relperiod_ind = this.roundAt0point6((this.matPlan[index].lieferfrist / 2));
            }
            else {
                var max_relperiod_ind = this.roundAt0point6(this.matPlan[index].summe);

                if (this.matPlan[index].bestellung === "---") {
                    this.matPlan[index].bestellung = "N.";
                }
            }

            if (!this.changed || this.indexsave != index) {

                this.urbestand = this.matPlan[index].bestandnWe.slice();
                this.urmenge = this.matPlan[index].bestellmenge;
            }

            for (var x = 0; x < this.matPlan[index].bestandnWe.length; x++) {
                if (x >= max_relperiod_ind) {

                    this.differenz = event - this.urmenge;
                    this.matPlan[index].bestandnWe[x] = this.urbestand[x] + Number(this.differenz);
                    this.matPlan[index].bestellmenge = event;
                    this.changed = true;
                    this.indexsave = index;
                    this.sessionService.setMatPlan(this.matPlan);
                }
            }
        }
    }

    getBruttoBedarfandPeriods() {
        if (this.sessionService.getForecast() === null) {
            alert("Bitte erst die Prognose durchführen.");
            this.sessionService.setMatPlan(null);
            this.sessionService.setPeriodRow(null);
            this.sessionService.setVerwendungRow(null);
            this.noperiod = true;
        }
        else {
            var forecast = new Array<any>();
            forecast.push(this.sessionService.getForecast());
            for (var i = 0; i < forecast[0].article.length; i++) {
                var planning = new rowtype();
                planning.produktkennung = forecast[0].article[i].produktkennung;
                for (var i2 = 0; i2 < forecast[0].article[i].geplanteProduktion.length; i2++) {
                    if (forecast[0].article[i].direktVerkauf.menge != 0 && forecast[0].article[i].geplanteProduktion[i2].periode == this.resultObj.results.period) {
                        planning.produktmengen.push(forecast[0].article[i].geplanteProduktion[i2].anzahl + forecast[0].article[i].direktVerkauf.menge);
                    }
                    else {
                        planning.produktmengen.push(forecast[0].article[i].geplanteProduktion[i2].anzahl);
                    }
                }
                this.plannings.push(planning);
            }
        }
        console.log("plannings", this.plannings);

    }

    bestellartSelected(bestellart: string, i: number) {
        this.matPlan[i].bestellung = bestellart;

        if (this.matPlan[i].bestellung === "---") {
            this.matPlan[i].bestellmenge = 0;
        }
        this.sessionService.setMatPlan(this.matPlan);
    }

    setLayout() {
        var period = Number(this.resultObj.results.period);
        for (var i = 0; i < 4; i++) {
            this.periodrow[i] = period + i;
        }
        document.getElementById("Verwendung").setAttribute("colspan", String(this.verwendungRow.length));
        document.getElementById("Bruttobedarf").setAttribute("colspan", String(this.periodrow.length));
        document.getElementById("Bestand").setAttribute("colspan", String(this.periodrow.length));
    }

    clearSession() {
        this.sessionService.clear();
    }
}