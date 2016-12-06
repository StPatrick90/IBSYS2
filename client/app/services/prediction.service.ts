import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PredictionService{
    constructor(private http:Http){
        console.log('Prediction Service Initialized...');
    }

    getBindingOrders(){
        return this.http.get('api/bindingOrders')
            .map(res => res.json());
    }

    getPlannings(){
        return this.http.get('api/plannings')
            .map(res => res.json());
    }
}

