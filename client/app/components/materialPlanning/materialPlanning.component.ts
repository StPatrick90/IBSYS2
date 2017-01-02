import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {MaterialPlanningService} from '../../services/materialPlanning.service';
import {Part} from '../../model/part';
import {matPlanRow} from "../../model/matPlanRow";
import sort = require("core-js/fn/array/sort");
import {Plannings} from "../../model/plannings";
import {Http} from "@angular/http";
import {rowtype} from "../../model/rowtype";

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

    setParameters() {
        this.getBruttoBedarfandPeriods();
        var i = 0;
        for (let purchPart of this.purchaseParts) {
            var matPlanRow = {
                kpartnr: null,
                lieferfrist: null,
                abweichung: null,
                summe: null,
                verwendung: [],
                diskontmenge: null,
                anfangsbestand: null,
                bruttobedarfnP: null,
                mengeohbest: null,
                bestellmenge: null,
                bestellung: null,
                bestandnWe: null
            }

            // collect values
            matPlanRow.kpartnr = purchPart.nummer;
            matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[i].startamount; // dbwerte falsch?
            matPlanRow.abweichung = purchPart.abweichung;
            matPlanRow.lieferfrist = purchPart.lieferfrist;
            matPlanRow.diskontmenge = purchPart.diskontmenge;
            matPlanRow.summe = Number((matPlanRow.lieferfrist + matPlanRow.abweichung).toFixed(2));
            for (let vw of purchPart.verwendung) {
                matPlanRow.verwendung.push(vw);

                // for (let p of this.plannings) {
                //     var i = 1;
                //     matPlanRow.bruttobedarfnP[i] += p.product1 * vw.Menge;
                //         i++;
                // }
            }

            // get Verwendungen
            for (var l = 0; l <= matPlanRow.verwendung.length - 1; l++) {
                if (!this.verwendungRow.includes(matPlanRow.verwendung[l].Produkt)) {
                    this.verwendungRow.push(matPlanRow.verwendung[l].Produkt);
                }
            }

            // store values finally
            this.matPlan.push(matPlanRow);
            i++;
        }
        this.setColspan();
    }

    getBruttoBedarfandPeriods() {
        this.plannings = this.sessionService.getPlannings();
        console.log("planningsmat", this.plannings);


    }

    setColspan() {
        document.getElementById("Verwendung").setAttribute("colspan", String(this.verwendungRow.length));
        document.getElementById("Bruttobedarf").setAttribute("colspan", String(this.periodrow.length));
    }

}
