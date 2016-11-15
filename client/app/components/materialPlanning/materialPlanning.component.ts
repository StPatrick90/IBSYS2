import {Component} from '@angular/core';
import {purchasepart} from '../../model/purchasepart';


@Component({
    moduleId: module.id,
    selector: 'materialPlanning',
    templateUrl: 'materialPlanning.component.html'
})

export class MaterialPlanningComponent {
    purchasepart: purchasepart[];
}
