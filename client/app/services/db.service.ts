/**
 * Created by philipp.koepfer on 19.11.16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class DBService{

    constructor(private http:Http){
        console.log('Database Service Initialized...');
    }

    addResults(result){
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('/api/result', JSON.stringify(result), {headers:headers})
            .map(res => res.json());
    }
    getResults(){
        return this.http.get('/api/results')
            .map(res => res.json());
    }
}
