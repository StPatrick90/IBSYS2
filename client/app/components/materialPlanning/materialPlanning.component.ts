import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {MaterialPlanningService} from '../../services/materialPlanning.service';
import {Part} from '../../model/part';
import {matPlanRow} from "../../model/matPlanRow";
import sort = require("core-js/fn/array/sort");
import {Http} from "@angular/http";
import {rowtype} from "../../model/rowtype";
import {vorigeBestellung} from "../../model/vorigeBestellung";
import {Forecast} from '../../model/forecast';


@Component({
    moduleId: module.id,
    selector: 'materialPlanning',
    templateUrl: 'materialPlanning.component.html'
})
// TODO : Jonas: 1)ab 0,6 aufrunden -- erledigt 2)Modus berücksichtigen -- erledigt 3)um autom. Eilbestellung erweitern Zeile 213--erledigt 4)Bestellmenge Zeile 204 --erledigt 5)update event / NgModel nach input bestellmenge 6)evtl Lernen 10% vom durchschnittlichen Bedarf wenns normalerweise noch langen würde aber trotzdem Eil
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
        // if (this.sessionService.getMatPlan() == null || this.sessionService.getActualPeriod() != Number(this.resultObj.results.period)) {
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

            // set Bestellmenge (Bestand n gepl.WE zeigt Bestand am ENDE einer Periode, desw auch max_relperiod -1)
            // TODO: max_relperiod_ind un warteperioden klären wann das jetzt tatsächlich ankommt bzw obs so richtig ist ausgehend kommmentar Zeile 194
            matPlanRow.bestellmenge = 0;
            matPlanRow.bestellung = "---";
            var bereitseilbestellt: boolean = false;
            var max_relperiod_ind: number;
            var vorigemengen: number = 0;

            max_relperiod_ind = this.roundAt0point6(matPlanRow.summe) - 1; // schliesst alle perioden aus, die man in der nächsten Periode noch normal bestellen kann
            // --> gibt also den index der spätesten relevanten perioe

            var warteperioden = this.roundAt0point6(matPlanRow.summe) - 1;// nur zum Verständnis, eig unnötig siehe max_relperiod_ind

            for (var i = 0; i <= max_relperiod_ind; i++) {
                vorigemengen += matPlanRow.bestandnWe[i];
            }

            for (var i = 0; i <= max_relperiod_ind; i++) {
                if ((matPlanRow.bestandnWe[i] + matPlanRow.mengemitbest + vorigemengen) < 0) {

                    if (i < warteperioden) { // Eilbestellung wenn Bestellung erst ankommen würde wenn Bestand schon leer ist
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
        this.sessionService.setActualPeriod(Number(this.resultObj.results.period));
        this.setLayout();
    }

// else {
//     console.log("Kaufteildispo bereits in Session eingebunden. - nach Änderungen auf der Datenbank bitte neue Session starten");
//     this.periodrow = this.sessionService.getPeriodRow();
//     this.verwendungRow = this.sessionService.getVerwendungRow();
//     this.matPlan = this.sessionService.getMatPlan();
//     this.setLayout();
// }
// }
//
//     eilBestellungifNegativ(matPlanRow: matPlanRow, vorigeBestellungen: any) {
//         var MatPlan = new Array<matPlanRow>();
//         var negativperiode: number; //periode in der bestandnWe negativ wird
//         var negativ: boolean;
//         MatPlan.push(matPlanRow);
//         negativ = false;
//
//         for (var i = 0; i < MatPlan.length; i++) {
//             for (var i2 = 0; i2 < MatPlan[0].bestandnWe.length; i2++) {
//                 // MatPlan[i].bestandnWe[i2] = -10; // später muss das raus
//                 if (MatPlan[i].bestandnWe[i2] < 0) {
//                     negativperiode = Number(this.resultObj.results.period) + i2;
//                     for (let vb of vorigeBestellungen) {
//                         if (vb.teil == MatPlan[i].kpartnr) {
//                             if (negativperiode < vb.ankunftperiode) {
//                                 console.log("zuper");
//                                 negativ = true;
//                             }
//                             else {
//                                 console.log("zuper2");
//                                 negativ = false;
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//         return negativ;
//     }

    roundAt0point6(zahl: number) {
        if (zahl % 1 >= 0.6) {
            zahl = Math.ceil(zahl);
        }
        else {
            zahl = Math.floor(zahl);
        }
        return zahl;
    }

    getBruttoBedarfandPeriods() {
        if (this.sessionService.getForecast() === null) {
            alert("Bitte erst die Prognose durchführen.");
        }
        else {
            var forecast = new Array<any>();
            forecast.push(this.sessionService.getForecast());

            for (var i = 0; i < forecast[0].article.length; i++) {
                var planning = new rowtype();
                planning.produktkennung = forecast[0].article[i].produktkennung;
                for (var i2 = 0; i2 < forecast[0].article[i].geplanteProduktion.length; i2++) {
                    planning.produktmengen.push(forecast[0].article[i].geplanteProduktion[i2].anzahl);
                }
                this.plannings.push(planning);
            }
            console.log(forecast);
            console.log(this.plannings)
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