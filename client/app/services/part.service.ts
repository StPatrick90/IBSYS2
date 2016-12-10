/**
 * Created by Paddy on 13.11.2016.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class PartService{
    constructor(private http:Http){
        console.log('Part Service Initialized...');
    }

    getParts(){
        return this.http.get('api/parts')
            .map(res => res.json());
    }

    getEPParts(){
        return this.http.get('api/epparts')
            .map(res => res.json());
    }

    getWorkstationsAndPartsAndBearbeitung() {
        return Observable.forkJoin(
            this.http.get('/api/workstations').map(res => res.json()),
            this.http.get('/api/parts').map(res => res.json()),
            this.http.get('/api/processingTimes').map(res => res.json())
        );
    }

    getProcessingTimes() {
        return this.http.get('api/processingTimes')
            .map(res => res.json());
    }

    addPart(newPart){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/part', JSON.stringify(newPart), {headers:headers})
            .map(res => res.json());
    }

    addProcessingTimes(newProcessingTimes){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/processingTimes', JSON.stringify(newProcessingTimes), {headers:headers})
            .map(res => res.json());
    }
    updatePart(part){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.put('/api/part/' + part._id, JSON.stringify(part), {headers:headers})
            .map(res => res.json());
    }

    deleteProcessingTimes(ids){
        return this.http.delete('/api/processingTime/' + ids)
            .map(res => res.json());
    }

    deletePart(id){
        return this.http.delete('/api/part/' + id)
            .map(res => res.json());
    }
}