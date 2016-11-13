import { Component } from '@angular/core';
import { PredictionService } from '../../services/prediction.service';

@Component({
    moduleId: module.id,
    selector: 'prediction',
    templateUrl: 'prediction.component.html'
})
export class PredictionComponent {
    constructor(private predictionsService:PredictionService){
        this.predictionsService.getPeriods()
            .subscribe(periods => {
                console.log(periods);
            });
    }
}

