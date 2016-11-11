/**
 * Created by Paddy on 11.11.2016.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class WorkstationService{
    constructor(private http:Http){
        console.log('Workstation Service Initialized...');
    }

    getWorkstations(){
        return this.http.get('api/workstations')
            .map(res => res.json());
    }
}