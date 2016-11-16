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

    generatePeriods(){
        this.period = parseInt(this.resultObjs.results.period, 10);
        this.periods.push(this.period + 1);
        this.periods.push(this.period + 2);
        this.periods.push(this.period + 3);
        console.log(this.periods);
        /*
        for(var i = 0; i < 3; i++){
            this.period = this.period + 1;
            this.periods.push(this.period);
        }*/
    }

    generateArray(obj){
        return Object.keys(obj).map((key)=>{ return obj[key]});
    }

    /*getPeriodFromSessionStorage(){
        this.resultObj = this.sessionService.getResultObject();
        function iterateOverObject(resultObj){
            for(var key in resultObj){
                if(resultObj.hasOwnProperty(key) && key.valueOf() == "period"){
                    var val = resultObj[key];
                    console.log(val);
                    iterateOverObject(val);
                }
            }
        }
        iterateOverObject(this.resultObj);
    }*/

}

