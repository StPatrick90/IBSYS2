/**
 * Created by Paddy on 21.10.2016.
 */
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import {SessionStorage} from "angular2-localstorage/WebStorage";

@Injectable()
export class SessionService{

    @SessionStorage() public resultObj;


    getResultObject(){
        return this.resultObj? this.resultObj: {};
    }
    setResultObject(Obj){
        this.resultObj = Obj;
    }
}
