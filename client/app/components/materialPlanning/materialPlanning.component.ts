import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {MaterialPlanningService} from '../../services/materialPlanning.service';
import {Part} from '../../model/part';
import {matPlanRow} from "../../model/matPlanRow";
import {verwendung} from "../../model/verwendung";
import sort = require("core-js/fn/array/sort");

@Component({
    moduleId: module.id,
    selector: 'materialPlanning',
    templateUrl: 'materialPlanning.component.html'
})

export class MaterialPlanningComponent {

    resultObj: any;
    purchaseParts: Part[];
    matPlanRow: matPlanRow;
    matPlan: matPlanRow[];
    verwendungRow: string[];
    colspan: number;

    constructor(private sessionService: SessionService, private  materialPlanningService: MaterialPlanningService) {
        this.resultObj = this.sessionService.getResultObject();
        this.matPlanRow = new matPlanRow();
        this.matPlan = new Array<matPlanRow>();

        this.verwendungRow = new Array<string>();
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

        for(let purchPart of this.purchaseParts){
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
            for(let vw of purchPart.verwendung){
                matPlanRow.verwendung.push(vw);
            }

            for (var l = 0; l <= matPlanRow.verwendung.length - 1; l++) {
                if (!this.verwendungRow.includes(matPlanRow.verwendung[l].Produkt)) {
                    this.verwendungRow.push(matPlanRow.verwendung[l].Produkt);
                }
            }

            // store them finally
            this.matPlan.push(matPlanRow);
            //console.log(this.matPlan[i].verwendung[1].Menge);
            i++;

        }
        this.setColspan();
    }

    setColspan() {
        document.getElementById("Verwendung").setAttribute("colspan", String(this.verwendungRow.length));
    }

}
