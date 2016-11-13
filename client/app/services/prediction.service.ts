import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PredictionService{
    constructor(private http:Http){
        console.log('Prediction Service Initialized...');
    }

    getPeriods(){
        return this.http.get('api/periods');
        .map(res => res.json());
    }
}

