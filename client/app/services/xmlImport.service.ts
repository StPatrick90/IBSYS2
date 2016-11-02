/**
 * Created by philipp.koepfer on 02.11.16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class XmlImportService{

    constructor(private http: Http){
        console.log('XmlImport Service Initialized...');
    }

}
