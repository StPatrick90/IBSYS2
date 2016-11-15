import {Injectable} from "@angular/core";
import {Http} from "@angular/http";

@Injectable()
export class MaterialPlanningService {
    constructor(private http:Http){
        console.log('MaterialPlanning Service Initialzed...');
    }
    //getter schreiben
}