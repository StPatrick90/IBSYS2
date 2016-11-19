import { Component } from '@angular/core';
import { SessionService } from '../../services/session.service';


@Component({
    moduleId: module.id,
    selector: 'prediction',
    templateUrl: 'prediction.component.html'
})
export class PredictionComponent {
    sessionService: any;
    resultObjs;
    period: number;
    periods = [];

    constructor(sessionService:SessionService) {
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
    }

    generatePeriods(index: number){
        this.period = parseInt(this.resultObjs.results.period, 10);
        this.periods.push(this.period);
        this.periods.push(this.period + 1);
        this.periods.push(this.period + 2);
        this.periods.push(this.period + 3);
        return this.periods[index];
    }

    generateArray(obj){
        return Object.keys(obj).map((key)=>{ return obj[key]});
    }
}

