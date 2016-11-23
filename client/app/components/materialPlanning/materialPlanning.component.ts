import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {MaterialPlanningService} from '../../services/materialPlanning.service';
import {Part} from '../../model/part';
import {matPlanRow} from "../../model/matPlanRow";

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

    constructor(private sessionService: SessionService, private  materialPlanningService: MaterialPlanningService) {
        this.resultObj = this.sessionService.getResultObject();
        this.matPlanRow = new matPlanRow();
        this.matPlan = new Array<matPlanRow>();
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
        for (var i = 0; i <= this.purchaseParts.length - 1; i++) {
            // declaration
            var matPlanRow = {
                kpartnr: this.matPlanRow.kpartnr,
                lieferfrist: this.matPlanRow.lieferfrist,
                abweichung: this.matPlanRow.abweichung,
                summe: this.matPlanRow.summe,
                verwendung: this.matPlanRow.verwendung,
                diskontmenge: this.matPlanRow.diskontmenge,
                anfangsbestand: this.matPlanRow.anfangsbestand,
                bruttobedarfnP: this.matPlanRow.bruttobedarfnP,
                mengeohbest: this.matPlanRow.mengeohbest,
                bestellmenge: this.matPlanRow.bestellmenge,
                bestellung: this.matPlanRow.bestellung,
                bestandnWe: this.matPlanRow.bestandnWe
            }
            // collect values
            matPlanRow.kpartnr = this.purchaseParts[i].nummer;
            matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[i].startamount;
            this.matPlan[i] = matPlanRow;
        }
    }

}
