/**
 * Created by philipp.koepfer on 02.11.16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Task } from '../../Task';

@Injectable()
export class XmlImportService{

    constructor(private http: Http){
        console.log('XmlImport Service Initialized...');
    }

    convertToJson(xml){
        var xmlneu = {name: xml};
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(xml);
        return this.http.post('/api/xmlConverter', JSON.stringify(xmlneu), {headers:headers})
            .map(res => res.json());
    }
}
