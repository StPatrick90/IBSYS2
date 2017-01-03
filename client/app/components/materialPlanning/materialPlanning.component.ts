import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {MaterialPlanningService} from '../../services/materialPlanning.service';
import {Part} from '../../model/part';
import {matPlanRow} from "../../model/matPlanRow";
import sort = require("core-js/fn/array/sort");
import {Plannings} from "../../model/plannings";
import {Http} from "@angular/http";
import {rowtype} from "../../model/rowtype";
import {stringify} from "@angular/platform-browser/src/facade/lang";
import {isNumber} from "util";

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

    constructor(private sessionService: SessionService, private  materialPlanningService: MaterialPlanningService, private http: Http) {
        this.resultObj = this.sessionService.getResultObject();
        this.matPlan = new Array<matPlanRow>();
        this.verwendungRow = new Array<string>();
        this.periodrow = new Array<number>();
        this.plannings = new Array<rowtype>();
        this.getKParts();
    }

    getKParts() {
        this.materialPlanningService.getKParts()
            .subscribe(data => {
                    this.purchaseParts = data
                },
                err => console.error(err),

                () => this.setParameters())
    };


    //TODO: Perioden von Yannik über session service holen (derzeit kommt immer nur die selbe), danach restliche tabelle
    setParameters() {
        console.log("result: ", this.resultObj);
        this.getBruttoBedarfandPeriods();
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
                bestellung: null,
                bestandnWe: null,
                isneg: null
            }

            // collect values
            matPlanRow.kpartnr = purchPart.nummer;
            index = matPlanRow.kpartnr as number - 1;
            matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[index].startamount;
            matPlanRow.abweichung = purchPart.abweichung;
            matPlanRow.lieferfrist = purchPart.lieferfrist;
            matPlanRow.diskontmenge = purchPart.diskontmenge; // werte bei diskontmenge in db und excel unterscheiden sich, auch ab überprüfen
            console.log("PN:", purchPart.nummer, "dm", purchPart.diskontmenge);
            matPlanRow.summe = Number((matPlanRow.lieferfrist + matPlanRow.abweichung).toFixed(2));

            // get Verwendungen
            for (let vw of purchPart.verwendung) {
                matPlanRow.verwendung.push(vw);
            }

            // get Bruttobedarf
            matPlanRow.bruttobedarfnP.push(0);
            for (let p of this.plannings) {
                while (matPlanRow.bruttobedarfnP.length < p.produktmengen.length) {
                    matPlanRow.bruttobedarfnP.push(0);
                }
                if (this.periodrow.length < 4) { // später if(!this.periodrow.includes(p.period)) {...}, wenn korrekte perioden von prediction übertragen werden
                    this.periodrow.push(p.period);
                }
            }
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
            }
            if (matPlanRow.mengeohbest < 0) {
                matPlanRow.isneg = true;
            }
            else {
                matPlanRow.isneg = false;
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
        this.setColspan();
    }

    getBruttoBedarfandPeriods() {
        this.plannings = this.sessionService.getPlannings();
        if (this.plannings === null) {
            alert("Bitte erst die Prognose durchführen.");
        }
    }

    setColspan() {
        document.getElementById("Verwendung").setAttribute("colspan", String(this.verwendungRow.length));
        document.getElementById("Bruttobedarf").setAttribute("colspan", String(4));
    }

}
