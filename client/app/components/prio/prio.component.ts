/**
 * Created by philipp.koepfer on 10.12.16.
 */
import {Component} from '@angular/core';

import {SessionService} from '../../services/session.service';
import {PartService} from '../../services/part.service';

import {Part} from '../../model/part';
import {PrioTask} from '../../model/prioTask';
import {ProcessingTime} from '../../model/processingTime';
import {Workstation} from '../../model/workstastion';
import {WorkingTime} from '../../model/workingTime';


@Component({
    moduleId: module.id,
    selector: 'prio',
    templateUrl: 'prio.component.html'
})
export class PrioComponent {

    selector = "";

    parts: Array<Part> = [];
    epParts: Array<Part> = [];
    pParts: Array<Part> = [];

    resultObj: any;
    wartelisteMaterial: any;
    wartelisteArbeitsplatz: any;
    produzierbareAuftraege: Array<PrioTask> = [];
    nPAuftraege: Array<PrioTask> = [];
    lager: any;
    reihenfolgen: Array<Array<PrioTask>> = [];

    processingTimes: Array<ProcessingTime> = [];

    zeiten: Array<WorkingTime> = [];

    //TODO: Replace number with part
    /*
    Alternativ Ablauf?
    Schaue bei Endprodukt (z.b. p1) nach ob es genug Material gibt?
    Wenn Ja --> Produzieren
    Wenn Nein --> Endprodukt = Endprodukt.Bestanteil x
     */
    defaultAblauf: Array<number> = [18, 13, 7, 19, 14, 8, 20, 15, 9, 49, 10, 4, 54, 11, 5, 29, 12, 6, 50, 17, 16, 55, 30, 51, 26, 56, 31, 1, 2, 3];

    constructor(private sessionService: SessionService, private  partService: PartService) {
    }

    ngOnInit() {
        this.processingTimes = this.sessionService.getProcessingTimes();

        this.resultObj = this.sessionService.getResultObject();

        this.lager = this.resultObj.results.warehousestock.article;
        this.wartelisteMaterial = this.resultObj.results.waitingliststock;
        this.wartelisteArbeitsplatz = this.resultObj.results.waitinglistworkstations;

        this.partService.getParts()
            .subscribe(
                data => {
                    this.parts = data;
                    this.epParts = data.filter(item => item.typ == "E" || item.typ == "P");
                    this.pParts = data.filter(item => item.typ == "P");
                },
                err => console.error(err),
                () => this.processOptimizaition());

        console.log(this.sessionService.getPartOrders());
    }

    processOptimizaition() {
        for (var teil of this.defaultAblauf) {
            var bestandteilArray =  this.getPartCapacities(teil);
            //console.log(bestandteilArray);
            //Kann was von np abgearbeitet werden?
            var mockAuftragProTeil = 40;
            //Sind Teile da?
            for(var bestandteil of bestandteilArray){
                var verfuegbar = "";
                if(bestandteil.lagerBestand > 0){
                    //JA
                    if(bestandteil.lagerBestand >= (mockAuftragProTeil * bestandteil.lagerBestand.anzahl)){
                        //komplett
                        var prioTask = new PropertyName
                        this.produzierbareAuftraege.push()

                    }else{
                        //Nur teilweise

                    }
                }
                else{
                    //NEIN

                }
            }
                //Wenn ja dann suche dir den ersten Prozessschritt zu Teil nr. x
                    //Welcher Arbeitsplatz?

                    //Wann ist Zeit und wieviel?
                        //Füge ganz hinzu, teilweise oder garnicht! -> npListe

            //Suche nächsten Arbeitsplatz Repeat ab Zeile 70;


            var inArray = false;

            //Zeiten Addieren, wenn Arbeitsplatz schon bearbeitet wurde.
            /*
            for (var zeit of this.zeiten) {
                if (zeit.arbeitsplatz.nummer === prozessSchritt.arbeitsplatz.nummer) {
                    zeit.ruestZeit += prozessSchritt.ruestZeit;
                    zeit.fertigungsZeit += prozessSchritt.fertigungsZeit;
                    inArray = true;
                }
            }
            if (!inArray) {
                var workTime = new WorkingTime();
                workTime.arbeitsplatz = prozessSchritt.arbeitsplatz;
                workTime.ruestZeit = prozessSchritt.ruestZeit;
                workTime.fertigungsZeit = prozessSchritt.fertigungsZeit;

                this.zeiten.push(workTime);
            }

            //Lager abziehen
            //Bestellung addieren
            */
        }
        //console.log(this.zeiten);
    }

    getFreeCapacitieforWorkstation(workstation){

    }

    getPartCapacities(searchPart){
        var bestandteilArray = [];
        for(var part of this.epParts){
            if(part.nummer === searchPart){
                for(var bestandteil of part.bestandteile){
                    for(var pt of this.parts){
                        if(bestandteil._id === pt._id){
                            for(var artikel of this.lager){
                                if(Number.parseInt(artikel.id) === pt.nummer){
                                    bestandteilArray.push({teil:pt, anzahl: bestandteil.anzahl, lagerBestand: Number.parseInt(artikel.amount)})
                                }
                            }
                        }
                    }
                }
            }
        }
        return bestandteilArray;
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