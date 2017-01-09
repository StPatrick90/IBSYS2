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
    bestellarten: string[];
    vorigeBestellungen: vorigeBestellung[];

    constructor(private sessionService: SessionService, private  materialPlanningService: MaterialPlanningService, private http: Http) {
        this.resultObj = this.sessionService.getResultObject();
        this.matPlan = new Array<matPlanRow>();
        this.verwendungRow = new Array<string>();
        this.periodrow = new Array<number>();
        this.plannings = new Array<rowtype>();
        this.getKParts();
        this.bestellarten = new Array<string>("E.", "N.", "---");
        this.vorigeBestellungen = new Array<vorigeBestellung>();
    }

    getKParts() {
        this.materialPlanningService.getKParts()
            .subscribe(data => {
                    this.purchaseParts = data
                },
                err => console.error(err),

                () => this.setParameters())
    };

    setvorigeBestellungen() {

        var aktuellePeriode: number;

        for (var i = 0; i < this.resultObj.results.inwardstockmovement.order.length; i++) {
            var vorigeBestellung = {
                teil: null,
                menge: null,
                orderperiode: null,
                ankunftperiode: null
            }

            vorigeBestellung.menge = this.resultObj.results.inwardstockmovement.order[i].amount;
            vorigeBestellung.orderperiode = this.resultObj.results.inwardstockmovement.order[i].orderperiod;
            vorigeBestellung.teil = this.resultObj.results.inwardstockmovement.order[i].article;

            for (let p of this.purchaseParts) {
                if (p.nummer == vorigeBestellung.teil) {
                    vorigeBestellung.ankunftperiode = Math.round(p.lieferfrist + p.abweichung + Number(vorigeBestellung.orderperiode));
                    this.vorigeBestellungen.push(vorigeBestellung);
                }
            }
        }
    }

    setParameters() {
        // if (this.sessionService.getMatPlan() == null) {
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
            matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[index].startamount;
            matPlanRow.abweichung = purchPart.abweichung;
            matPlanRow.lieferfrist = purchPart.lieferfrist;
            matPlanRow.diskontmenge = purchPart.diskontmenge; // werte bei diskontmenge in db und excel unterscheiden sich, auch ab überprüfen
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
                    vb.ankunftperiode = purchPart.lieferfrist + purchPart.abweichung + Number(vb.orderperiode);

                    if (Math.round(vb.ankunftperiode) <= aktuellePeriode) {
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

            // set Bestellmenge
            matPlanRow.bestellmenge = 1000;

            // set Bestand n. Wareneingang
            matPlanRow.bestandnWe = new Array<number>(4);
            // console.log(this.vorigeBestellungen);
            for (var i = 0; i < matPlanRow.bestandnWe.length; i++) {
                if (i === 0) {
                    matPlanRow.bestandnWe[i] = matPlanRow.anfangsbestand - matPlanRow.bruttobedarfnP[i];
                }
                else {
                    matPlanRow.bestandnWe[i] = matPlanRow.bestandnWe[i - 1] - matPlanRow.bruttobedarfnP[i];
                }
            }
            for (let vb of this.vorigeBestellungen) { // mit .some arbeiten ?
                for (var i2 = 0; i2 < matPlanRow.bestandnWe.length; i2++) {
                    if (matPlanRow.kpartnr == vb.teil && Math.round(vb.ankunftperiode) == Number(this.resultObj.results.period) + i2) {
                        matPlanRow.bestandnWe[i2] += Number(vb.menge);
                    }
                }
            }

            // set Normal-/Eilbestellung
            if (matPlanRow.mengeohbest < 0 && matPlanRow.summe * matPlanRow.bruttobedarfnP[0] > matPlanRow.anfangsbestand) {
                matPlanRow.bestellung = "E.";
            }
            else {
                if (matPlanRow.mengeohbest <= 0) {
                    matPlanRow.bestellung = "N.";
                }
                else {
                    matPlanRow.bestellung = "---"
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
        this.sessionService.setVerwendungRow(this.verwendungRow);
        this.sessionService.setPeriodRow(this.periodrow);
        this.sessionService.setMatPlan(this.matPlan);
        this.setLayout();
        // }
        // else {
        //     console.log("Kaufteildispo bereits in Session eingebunden. - nach Änderungen auf der Datenbank bitte neue Session starten");
        //     this.periodrow = this.sessionService.getPeriodRow();
        //     this.verwendungRow = this.sessionService.getVerwendungRow();
        //     this.matPlan = this.sessionService.getMatPlan();
        //     this.setLayout();
        // }
    }

    getBruttoBedarfandPeriods() {
        this.plannings = this.sessionService.getPlannings();
        if (this.plannings === null) {
            alert("Bitte erst die Prognose durchführen.");
        }
    }

    bestellartSelected(bestellart: string, i: number) {
        this.matPlan[i].bestellung = bestellart;
        this.sessionService.setMatPlan(this.matPlan);
    }

    bestellmengeChange(newvalue, index) {
        if (newvalue >= 0) {
            this.matPlan[index].bestellmenge = newvalue;
            this.sessionService.setMatPlan(this.matPlan);
        }
        else {
            alert("Bitte positiven Wert eingeben !")
        }
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
