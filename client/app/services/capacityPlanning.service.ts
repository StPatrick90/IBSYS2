/**
 * Created by Paddy on 03.11.2016.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class CapacityPlanningService{
    constructor(private http:Http){
        console.log('CapacityPlanning Service Initialized...');
    }

    getWorkstations(){
        return this.http.get('api/workstations')
            .map(res => res.json());
    }
    /*
    getProcessingTimes(){
        return this.http.get('api/processingTimes')
            .map(res => res.json());
    }
    get_EP_Parts(){
        return this.http.get('api/epparts')
            .map(res => res.json());
    }
    */
    getTimesAndEPParts() {
        return Observable.forkJoin(
            this.http.get('/api/processingTimes').map(res => res.json()),
            this.http.get('/api/epparts').map(res => res.json())
        );
    }
}