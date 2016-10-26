/**
 * Created by Paddy on 21.10.2016.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AppService{
    constructor(private http:Http){
        console.log('App Service Initialized...');
    }

    toggleSidebar(toggle) {
        localStorage.setItem('toggle', toggle.toString());
    }
}
