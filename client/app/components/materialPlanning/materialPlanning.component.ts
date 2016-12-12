import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {MaterialPlanningService} from '../../services/materialPlanning.service';
import {Part} from '../../model/part';
import {matPlanRow} from "../../model/matPlanRow";
import sort = require("core-js/fn/array/sort");
import {PredictionComponent} from "../prediction/prediction.component";
import {PredictionService} from "../../services/prediction.service";
import {DBService} from "../../services/db.service";

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
    predictionComponent: PredictionComponent;
    predictionService: PredictionService;
    dbService: DBService;
    periodrow: number[];

    constructor(private sessionService: SessionService, private  materialPlanningService: MaterialPlanningService) {
        this.resultObj = this.sessionService.getResultObject();
        this.matPlan = new Array<matPlanRow>();
        this.verwendungRow = new Array<string>();
        this.periodrow = new Array<number>();
        this.predictionComponent = new PredictionComponent(sessionService, this.predictionService, this.dbService);
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
        this.getBruttoBedarfandPeriods();
        this.setColspan();
    }

    setColspan() {
        document.getElementById("Verwendung").setAttribute("colspan", String(this.verwendungRow.length));
        document.getElementById("Bruttobedarf").setAttribute("colspan", String(this.periodrow.length));
    }

    getBruttoBedarfandPeriods() {

        var periods = new Array<number>();
        periods.push(this.predictionComponent.generatePeriods(0));
        periods.push(this.predictionComponent.generatePeriods(1));
        periods.push(this.predictionComponent.generatePeriods(2));
        periods.push(this.predictionComponent.generatePeriods(3));
        this.periodrow = periods;
    }

}
