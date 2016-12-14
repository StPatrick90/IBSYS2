/**
 * Created by philipp.koepfer on 10.12.16.
 */
import { Component } from '@angular/core';

import {SessionService} from '../../services/session.service';
import {PartService} from '../../services/part.service';

import {Part} from '../../model/part';
import {PrioTask} from '../../model/prioTask';
import {ProcessingTime} from '../../model/processingTime';



@Component({
    moduleId: module.id,
    selector: 'prio',
    templateUrl: 'prio.component.html'
})
export class PrioComponent {

    selector = "";

    epParts : Array<Part> = [];
    pParts : Array<Part> = [];

    resultObj: any;
    wartelisteMaterial: any;
    wartelisteArbeitsplatz: any;
    produzierbareAuftraege: Array<PrioTask> = [];
    nPAuftraege: Array<PrioTask> = [];
    lager: any;
    reihenfolgen: Array<Array<PrioTask>> = [];

    processingTimes: Array<ProcessingTime> = [];

    //TODO: Replace number with part
    defaultAblauf: Array<number> = [18,13,7,19,14,8,20,15,9,49,10,4,54,11,5,29,12,6,50,17,16,55,30,51,26,56,31];

    constructor(private sessionService: SessionService, private  partService: PartService) {
    }

    ngOnInit(){
        this.partService.getEPParts()
            .subscribe(
                data => {
                    this.epParts = data;
                    this.pParts = data.filter(item => item.typ == "P");
                },
                err => console.error(err),
                () => console.log(this.pParts));

        this.processingTimes =  this.sessionService.getProcessingTimes();

        this.resultObj = this.sessionService.getResultObject();
        console.log(this.resultObj);

        this.lager = this.resultObj.results.warehousestock.article;
        this.wartelisteMaterial = this.resultObj.results.waitingliststock;
        this.wartelisteArbeitsplatz = this.resultObj.results.waitinglistworkstations;
    }

    processOptimizaition(){

        for(var schritt of this.defaultAblauf){
            for(var prozessSchritt of this.processingTimes){
                if(prozessSchritt.teil.nummer === schritt){

                }
            }
        }
    }




}


/*
    15 Arbeitsplätze

    Max: 9600 min pro Periode
    Eine Schicht mit Überstunden sind 3600 min.

 1. Schicht 2.400 Minuten
 2. Schicht 2.400 Minuten
 3. Schicht 2.400 Minuten
 */