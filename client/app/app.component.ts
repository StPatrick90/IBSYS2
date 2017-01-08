import { Component } from '@angular/core';
import { TaskService } from './services/task.service';
import { CapacityPlanningService } from './services/capacityPlanning.service';
import { AppService} from './services/app.service';
import { TranslateService } from './translate/translate.service';
import { XmlImportService } from './services/xmlImport.service';
import { WindowRef } from './services/window.service';
import { WorkstationService } from './services/workstation.service';
import { PartService } from './services/part.service';
import { SessionService} from './services/session.service';
import { DBService} from './services/db.service';
import {MaterialPlanningService} from './services/materialPlanning.service';
import {ProcessingTime} from "./model/processingTime";
import { PredictionService } from './services/prediction.service';
import {element} from "@angular/upgrade/src/angular_js";

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html',

    providers: [TaskService,CapacityPlanningService, AppService, TranslateService,
        XmlImportService, WindowRef, WorkstationService, PartService, SessionService, DBService, MaterialPlanningService, PredictionService]
})
export class AppComponent {
    mobileView:number = 992;
    toggle: boolean = false;
    language: string = "de";
    lastPeriod: string;

    constructor(private appService:AppService, private _translate: TranslateService,private materialPlanningService:MaterialPlanningService, private sessionService:SessionService,
                private partService:PartService, private  workstationService:WorkstationService, private dbService: DBService){
        this.attachEvents();
        this.language = (navigator.language || navigator.userLanguage).substring(0,2);
        this._translate.use(this.language);
        this.partService.getParts().subscribe(parts => {
            this.sessionService.setParts(parts)});
        this.workstationService.getWorkstations().subscribe(workstations => {
            this.sessionService.setWorkstations(workstations)});
        this.partService.getProcessingTimes().subscribe(processingTimes => {
            this.sessionService.setProcessingTimes(processingTimes)});
        this.dbService.getResults().subscribe(results => {
                    if(results.length > 0){
                        var lastResult = results.pop();
                        this.lastPeriod = lastResult.results.period;
                        this.sessionService.setResultObject(lastResult);
                    }
                }
            );
    }

    setPeriod(){
        this.lastPeriod = this.sessionService.getResultObject().results.period;
    }

    toggleSidebar(){
        this.toggle = !this.toggle;
        this.appService.toggleSidebar(this.toggle);
    }

    attachEvents() {
        window.onresize = ()=> {
            if (this.getWidth() >= this.mobileView) {
                if (localStorage.getItem('toggle')) {
                    this.toggle = !localStorage.getItem('toggle') ? false : true;
                } else {
                    this.toggle = true;
                }
            } else {
                this.toggle = false;
            }
        }
    }

    getWidth() {
        return window.innerWidth;
    }
    setLang(lang){
        this._translate.use(lang || this.language);
    }
}

