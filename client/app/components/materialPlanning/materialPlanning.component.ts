import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {MaterialPlanningService} from '../../services/materialPlanning.service';
import {Part} from '../../model/part';

@Component({
    moduleId: module.id,
    selector: 'materialPlanning',
    templateUrl: 'materialPlanning.component.html'
})

export class MaterialPlanningComponent {

    resultObj: any;
    openingStock: any;
    purchaseParts: Part[];

    constructor(private sessionService: SessionService, private  materialPlanningService: MaterialPlanningService) {
        this.resultObj = this.sessionService.getResultObject();
        this.setParameters();
    }

    setParameters() {
        this.openingStock = this.resultObj.results.warehousestock.article[0].startamount;
        this.getKParts();
    }

    getKParts() {
        this.materialPlanningService.getKParts().subscribe(
            data => {
                this.purchaseParts = data

                console.log(this.purchaseParts);
            },

            err => console.error(err),
            () => this.generateRows())

    };

    generateRows() {
        for (var purchasePart of this.purchaseParts) {

        }
    }

}
