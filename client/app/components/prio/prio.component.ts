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
import {Sequence} from '../../model/sequence';
import {WorkingTime} from '../../model/workingTime';
import {CapacityPlanningService} from '../../services/capacityPlanning.service';



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
    produzierbareAuftraege: Array<any> = [];
    nPAuftraege: Array<any> = [];
    lager: any;
    reihenfolgen: Array<Sequence> = [];
    /*
    {
        workStation: Workstation
    }
     */

    processingTimes: Array<ProcessingTime> = [];

    zeiten: Array<WorkingTime> = [];
    partOrders: Array<any> = [];

    //TODO: Replace number with part
    /*
    Alternativ Ablauf?
    Schaue bei Endprodukt (z.b. p1) nach ob es genug Material gibt?
    Wenn Ja --> Produzieren
    Wenn Nein --> Endprodukt = Endprodukt.Bestanteil x
     */
    defaultAblauf: Array<number> = [18, 13, 7, 19, 14, 8, 20, 15, 9, 49, 10, 4, 54, 11, 5, 29, 12, 6, 50, 17, 16, 55, 30, 51, 26, 56, 31, 1, 2, 3];

    constructor(private sessionService: SessionService, private  partService: PartService, private capacityPlanningService: CapacityPlanningService ) {
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
                () => {
                    this.partOrders = this.sessionService.getPartOrders();
                    this.capacityPlanningService.getWorkstations()
                        .subscribe(workstations => {
                            for(var workstation of workstations){
                                var sequence = new Sequence();
                                sequence.workstation = workstation;
                                sequence.prioTasks = [];
                                this.reihenfolgen.push(sequence);
                            };
                            this.processOptimizaition();
                        });
                });

    }

    processOptimizaition() {
        for (var partNumber of this.defaultAblauf) {
            var auftragsMenge = 0;
            for(var partOrder in this.partOrders){
                if(partOrder.includes(partNumber.toString())){
                    auftragsMenge += Number.parseInt(this.partOrders[partOrder]);
                }
            }

            //Kann was von np abgearbeitet werden?
            for(var idx in this.nPAuftraege){

                //Schau ob jetzt etwas im Lager ist.
                if((this.nPAuftraege[idx].Teil.lagerBestand / this.nPAuftraege[idx].anzahl) > 0){
                    this.nPAuftraege.splice(parseInt(idx), 1);
                    this.processWorkflow(this.nPAuftraege[idx].Teil, this.nPAuftraege[idx].Anzahl);
                }
            }
            console.log(auftragsMenge);
            this.processWorkflow(partNumber, auftragsMenge);
        }

        console.log("reihenfolge:");
        console.log(this.reihenfolgen);
        console.log("pAufträge:");
        console.log(this.produzierbareAuftraege);
        //console.log(this.zeiten);
    }

    processWorkflow(partNumber: number, auftraege: number){

        //Alle Bestandteile des Teils
        var bestandteilArray =  this.getPartComponents(partNumber);
        var part = this.getEPPart(partNumber);

        var canBeProduced = true;
        var anzahl = auftraege;
        //Sind Teile da?
        for(var bestandteil of bestandteilArray){
            var verfügbar = "";
            if((bestandteil.lagerBestand/bestandteil.anzahl) > 0){
                //JA
                if(bestandteil.lagerBestand >= (auftraege * bestandteil.anzahl)){
                    verfügbar = "ja";
                }else{
                    verfügbar = "teilweise";
                }
            }
            else{
                //NEIN
                verfügbar = "nein";
            }

            if(verfügbar === "teilweise"){
                //abrunden
                var produzierbareAuftraege = Math.floor(bestandteil.lagerBestand/bestandteil.anzahl);
                if(produzierbareAuftraege < anzahl)
                    anzahl = produzierbareAuftraege;
            }
            if(verfügbar === "nein"){
                canBeProduced = false;
                break;
            }
        }

        if(canBeProduced === true){
            if(anzahl === auftraege){
                var processTime = this.setPartToWorkplace(part, auftraege, bestandteilArray);

                this.produzierbareAuftraege.push({"Teil": part, "Anzahl": auftraege});
            }
            else{
                //Teilweise
                var processTime = this.setPartToWorkplace(part, anzahl, bestandteilArray);

                this.produzierbareAuftraege.push({"Teil": part, "Anzahl": anzahl});
                this.nPAuftraege.push({"Teil": part, "Anzahl": auftraege - anzahl});
            }
        }
        else{
            this.nPAuftraege.push({"Teil": part, "Anzahl": auftraege});
        }

        var inArray = false;
    }

    setPartToWorkplace(teil: Part, auftraege: number, bestandteilArray: any){

        // Alle Arbeitsplatz, die das Teil bearbeiten, sortiert -> Array
        var prozessingTime = null;
        var ptx = null;
        for(var pt of this.processingTimes){
            if((pt.teil.nummer == teil.nummer )&& pt.isStart){

                //First prozessingTime
                prozessingTime = pt;
                ptx = pt;
                break;
            }
        }
        
        //TODO: Lagerbestand mit Bestellungen anpassen!
        //TODO: Merge batch objects
        while(auftraege > 0){
            while(prozessingTime != null){

                var letzterAuftrag = new PrioTask();
                letzterAuftrag.ende = 0;
                var neuerAuftrag = new PrioTask();
                var gleichesTeil = false;

                neuerAuftrag.teil = prozessingTime.teil;
                neuerAuftrag.aktuellerAp = prozessingTime.arbeitsplatz;
                neuerAuftrag.naechsterAp = prozessingTime.nextArbeitsplatz;
                neuerAuftrag.periode = this.resultObj.results.period;
                neuerAuftrag.losgroesse = (auftraege % 10 === 0)? 10 : (auftraege % 10);

                for(var sequence of this.reihenfolgen){
                    if(sequence.workstation.nummer === prozessingTime.arbeitsplatz.nummer){
                        for(var auftrag of sequence.prioTasks){
                            if(letzterAuftrag != null){
                                if(letzterAuftrag.ende < auftrag.ende){
                                    if(letzterAuftrag.teil === auftrag.teil){
                                        gleichesTeil = true;
                                    }
                                    else {
                                        gleichesTeil = false;
                                    }

                                    letzterAuftrag = auftrag;
                                }
                            }
                        }
                    }
                }

                neuerAuftrag.start = letzterAuftrag.ende + 1;
                if(gleichesTeil){
                    neuerAuftrag.ende = letzterAuftrag.ende + ((auftraege % 10 === 0)? 10 : (auftraege % 10)) * prozessingTime.fertigungsZeit;
                }
                else{
                    neuerAuftrag.ende = letzterAuftrag.ende + ((auftraege % 10 === 0)? 10 : (auftraege % 10)) * prozessingTime.fertigungsZeit + prozessingTime.ruestZeit;
                }

                for(var sequence of this.reihenfolgen){
                    if(sequence.workstation.nummer === prozessingTime.arbeitsplatz.nummer){
                        neuerAuftrag._id = sequence.prioTasks.length+1;
                        sequence.prioTasks.push(neuerAuftrag);

                    }
                }

                //find next prozessingTime
                var processingTimeOld = prozessingTime;

                if(prozessingTime.nextArbeitsplatz){
                    for(var pt of this.processingTimes){
                        if((pt.teil.nummer == teil.nummer) && (pt.arbeitsplatz.nummer == prozessingTime.nextArbeitsplatz.nummer)){
                            prozessingTime = pt;
                            break;
                        }
                    }
                }
                if(prozessingTime == processingTimeOld){
                    prozessingTime = null;
                }
                break;
            }
            var bearbeiteteAuftrage = (auftraege % 10 === 0)? 10 : (auftraege % 10);

            //Lager anpassen
            for (var idx in this.lager) {
                if (Number.parseInt(this.lager[idx].id) === neuerAuftrag.teil.nummer) {
                    var lagerAmount = Number.parseInt(this.lager[idx].amount);
                    this.lager[idx].amount = (lagerAmount + bearbeiteteAuftrage).toString();
                }
                for (var bTeil of bestandteilArray) {
                    if(bTeil.teil.nummer == Number.parseInt(this.lager[idx].id)){
                        var rechnung = (Number.parseInt(this.lager[idx].amount) - (bearbeiteteAuftrage * bTeil.anzahl));
                        this.lager[idx].amount = rechnung.toString();
                    }
                }
            }

            auftraege -= bearbeiteteAuftrage;
        }

        return ptx;
    }

    getEPPart(partNumber: number){

        for(var part of this.epParts){
            if(part.nummer === partNumber){
                return part;
            }
        }
    }

    getPartComponents(searchPartNumber){
        var bestandteilArray = [];
        for(var part of this.epParts){
            if(part.nummer === searchPartNumber){
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