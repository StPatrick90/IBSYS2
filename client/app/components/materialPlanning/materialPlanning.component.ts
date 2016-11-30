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
        if (typeof this.resultObj != 'undefined') {
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
                matPlanRow.anfangsbestand = this.resultObj.results.warehousestock.article[i].startamount; // dbwerte falsch?
                matPlanRow.abweichung = this.purchaseParts[i].abweichung;
                matPlanRow.lieferfrist = this.purchaseParts[i].lieferfrist;
                matPlanRow.diskontmenge = this.purchaseParts[i].diskontmenge;
                matPlanRow.summe = Number((matPlanRow.lieferfrist + matPlanRow.abweichung).toFixed(2));
                for (var v = 0; v <= this.purchaseParts[i].verwendung.length - 1; v++) {
                    matPlanRow.verwendung[v] = this.purchaseParts[i].verwendung[v];
                }
                // get Verwendungen
                for (var l = 0; l <= matPlanRow.verwendung.length - 1; l++) {
                    if (!this.verwendungRow.includes(matPlanRow.verwendung[l])) {
                        this.verwendungRow.push(matPlanRow.verwendung[l]);
                    }
                }
                this.colspan = this.verwendungRow.length;
                this.matPlan[i] = matPlanRow;
            }
        }

        else {
            console.log("Please load XML");
        }
        this.setColspan();

        console.log(this.purchaseParts);
        console.log(this.purchaseParts);
    }

    setColspan() {
        document.getElementById("Verwendung").setAttribute("colspan", String(this.colspan));
    }

}
