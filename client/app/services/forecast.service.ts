/**
 * Created by Paddy on 14.01.2017.
 */

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class ForecastService{
    constructor(private http:Http){
        console.log('Forecast Service Initialized...');
    }
    getForecastAndParts() {
        return Observable.forkJoin(
            this.http.get('/api/forecasts').map(res => res.json()),
            this.http.get('/api/parts').map(res => res.json())
        );
    }

}