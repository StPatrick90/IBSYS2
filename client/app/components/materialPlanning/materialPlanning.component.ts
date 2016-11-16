import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';


@Component({
    moduleId: module.id,
    selector: 'materialPlanning',
    templateUrl: 'materialPlanning.component.html'
})

export class MaterialPlanningComponent {

    resultObj: any;
    price: number;
    openingStock;

    constructor(private sessionService: SessionService) {
        this.resultObj = this.sessionService.getResultObject();
        this.setParameters();

    }

    setParameters() {
        this.price = this.resultObj.results.warehousestock.article[0].price;
        this.openingStock = this.resultObj.results.warehousestock.article[0].startamount;
    }
}
