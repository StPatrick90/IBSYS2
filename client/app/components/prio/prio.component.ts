/**
 * Created by philipp.koepfer on 10.12.16.
 */
import {Component, ViewChild} from '@angular/core';

import {SessionService} from '../../services/session.service';
import {PartService} from '../../services/part.service';

import {Part} from '../../model/part';
import {PrioTask} from '../../model/prioTask';
import {ProcessingTime} from '../../model/processingTime';
import {Workstation} from '../../model/workstastion';
import {Sequence} from '../../model/sequence';
import {WorkingTime} from '../../model/workingTime';
import {CapacityPlanningService} from '../../services/capacityPlanning.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';



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

    processingTimes: Array<ProcessingTime> = [];

    zeiten: Array<WorkingTime> = [];
    partOrders: Array<any> = [];
    defaultAblauf: Array<number> = [];
    outPutArray: Array<Part> = [];

    @ViewChild('splitting')
    modalSplitting: ModalComponent;

    splittingPart: Part;
    splittingAnzahl: number;
    splittingAnzahl2: number;


    constructor(private sessionService: SessionService, private  partService: PartService, private capacityPlanningService: CapacityPlanningService ) {
    }

    ngOnInit() {
        this.defaultAblauf.push(18, 13, 7, 19, 14, 8, 20, 15, 9, 49, 10, 4, 54, 11, 5, 29, 12, 6, 50, 17, 16, 55, 30, 51, 26, 56, 31, 1, 2, 3);
        this.splittingPart = new Part();
        this.splittingAnzahl2 = 0;
        this.splittingAnzahl = 0;
        this.processingTimes = this.sessionService.getProcessingTimes();
        this.resultObj = this.sessionService.getResultObject();
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
                    console.log(this.partOrders);
                    this.capacityPlanningService.getWorkstations()
                        .subscribe(workstations => {
                            for(var workstation of workstations){
                                var sequence = new Sequence();
                                sequence.workstation = workstation;
                                sequence.prioTasks = [];
                                sequence.ruestzeit = 0;
                                this.reihenfolgen.push(sequence);
                            };
                        });
                });

    }

    onClickJumptron(area: string){
        this.produzierbareAuftraege.length = 0;
        this.nPAuftraege.length = 0;
        this.outPutArray.length = 0;

        if(area === 'automatic') {
            this.defaultAblauf.length = 0;
            this.defaultAblauf.push(18, 13, 7, 19, 14, 8, 20, 15, 9, 49, 10, 4, 54, 11, 5, 29, 12, 6, 50, 17, 16, 55, 30, 51, 26, 56, 31, 1, 2, 3);
        }
        if(area === 'endProduct'){
            this.defaultAblauf.length = 0;
            var counter = 0;
            for(var pPart of this.pParts){
                if(pPart.nummer === 1)
                    if(counter === 0)
                        this.defaultAblauf.push(18, 13, 7, 49, 10, 4, 50, 17, 16, 51, 26, 1);
                    else
                        this.defaultAblauf.push(18, 13, 7, 49, 10, 4, 50, 51, 1);
                if(pPart.nummer === 2)
                    if(counter === 0)
                        this.defaultAblauf.push(19, 14, 8, 54, 11, 5, 55 , 17, 16, 56, 26, 2);
                    else
                        this.defaultAblauf.push(19, 14, 8, 54, 11, 5, 55, 56, 2);
                if(pPart.nummer === 3)
                    if(counter === 0)
                        this.defaultAblauf.push(20, 15, 9, 29, 12, 6, 30, 17, 16, 31, 26, 3);
                    else
                        this.defaultAblauf.push(20, 15, 9, 29, 12, 6, 30, 31, 3);
                counter += 1;
            }
        }

        if(area === 'manual') {
            this.defaultAblauf.length = 0;
            for(var eTeilNummer of this.epParts){
                this.defaultAblauf.push(eTeilNummer.nummer);
            }
        }
        console.log("defautAblauf: ", this.defaultAblauf);
        this.processOptimizaition();
        this.selector = area;
    }

    processOptimizaition() {
        this.lager = JSON.parse(JSON.stringify(this.resultObj.results.warehousestock.article));

        this.updateStorage();
        for (var partNumber of this.defaultAblauf) {
            var auftragsMenge = 0;
            for(var partOrder in this.partOrders){
                var split = partOrder.split("_");
                if(Number.parseInt(split[1]) === partNumber){
                    auftragsMenge += Number.parseInt(this.partOrders[partOrder]);
                }
            }

            //Kann was von np abgearbeitet werden?
            for(var idx in this.nPAuftraege){

                //Schau ob jetzt etwas im Lager ist.
                if((this.nPAuftraege[idx].Teil.lagerBestand / this.nPAuftraege[idx].anzahl) > 0){
                    this.nPAuftraege.splice(parseInt(idx), 1);
                    this.processWorkflow(this.nPAuftraege[idx].Teil, this.nPAuftraege[idx].Anzahl, idx);
                }
            }
            this.processWorkflow(partNumber, auftragsMenge, null);
        }

        console.log("reihenfolge:");
        console.log(this.reihenfolgen);
        console.log("pAufträge:");
        console.log(this.produzierbareAuftraege);
        console.log("npAufträge:");
        console.log(this.nPAuftraege);

        this.outPutArray.length = 0;
        for(var auftrag of this.produzierbareAuftraege){
            this.outPutArray.push(auftrag);
        }
        for(var auftrag of this.nPAuftraege){
            this.outPutArray.push(auftrag);
        }

        this.sessionService.setReihenfolgen(this.reihenfolgen);
        this.sessionService.setPrioOutput(this.outPutArray);
    }

    processWorkflow(partNumber: number, auftraege: number, nPAuftragIdx: string){

        //Alle Bestandteile des Teils
        var bestandteilArray =  this.getPartComponents(partNumber);
        var part = this.getEPPart(partNumber);

        var canBeProduced = true;
        var anzahl = auftraege;

        //Sind Teile da?
        for(var bestandteil of bestandteilArray){
            var verfügbar = "";

            if((bestandteil.lagerBestand/bestandteil.anzahl) > 0 || auftraege === 0){
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
                if(nPAuftragIdx != null){
                    this.nPAuftraege[nPAuftragIdx].Anzahl = auftraege - anzahl;
                }
                else{
                    this.nPAuftraege.push({"Teil": part, "Anzahl": auftraege - anzahl});
                }
            }
        }
        else{
            if(nPAuftragIdx == null)
                this.nPAuftraege.push({"Teil": part, "Anzahl": auftraege});
        }
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
    // 16  56 11 8 31 6 12 9 20
        while(auftraege > 0){
            prozessingTime = ptx;
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
                for(var sequence of this.reihenfolgen){
                    if(sequence.workstation.nummer === neuerAuftrag.aktuellerAp.nummer){
                        if(sequence.prioTasks[sequence.prioTasks.length - 1]){
                            if(sequence.prioTasks[sequence.prioTasks.length - 1].ende > neuerAuftrag.start){
                                neuerAuftrag.start = sequence.prioTasks[sequence.prioTasks.length - 1].ende + 1;
                            }
                        }
                    }
                }

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

                        if(!gleichesTeil){
                            sequence.ruestzeit += prozessingTime.ruestZeit;
                        }
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

                                    console.log(pt.nummer, Number.parseInt(artikel.amount));
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

    updateStorage(){
        for(var idx in this.lager){
            if(this.wartelisteMaterial.missingpart){
                if(this.wartelisteMaterial.missingpart.length > 0){
                    for(var material of this.wartelisteMaterial.missingpart){
                        if(material.waitinglist.item == this.lager[idx].id){
                            if(material.waitinglist.period == this.resultObj.results.period){
                                var lagerMenge = Number.parseInt(this.lager[idx].amount);
                                var bestellMenge = Number.parseInt(material.waitinglist.amount);
                                this.lager[idx].amount = (lagerMenge + bestellMenge).toString();
                            }
                        }
                    }
                }
                else{
                    if(this.wartelisteMaterial.missingpart.waitinglist.item == this.lager[idx].id){
                        if(this.wartelisteMaterial.missingpart.waitinglist.period == this.resultObj.results.period){
                            var lagerMenge = Number.parseInt(this.lager[idx].amount);
                            var bestellMenge = Number.parseInt(this.wartelisteMaterial.missingpart.waitinglist.amount);
                            this.lager[idx].amount = (lagerMenge + bestellMenge).toString();
                            break;
                        }
                        break;
                    }
                }
            }
        }
    }

    reloadProcess(){
        if(this.selectedType === 'Yes'){
            if(this.selector === 'endProduct'){
                this.onClickJumptron('endProduct');
                return;
            }
            this.nPAuftraege.length = 0;
            this.outPutArray.length = 0;
            this.defaultAblauf.length = 0;
            for(var pAuftrag of this.produzierbareAuftraege){
                var nr = pAuftrag.Teil.nummer;
                var isInArray = false;
                for(var defNr of this.defaultAblauf){
                    if(nr === defNr){
                        isInArray = true;
                    }
                }
                if(!isInArray)
                    this.defaultAblauf.push(nr);
            }
            this.produzierbareAuftraege.length = 0;
            this.processOptimizaition();
        }
    }


    //Splitting
    setModalView(object, index){
        this.splittingAnzahl2 = object.Anzahl;
        this.splittingPart = object.Teil;
        this.splittingAnzahl = Math.round(object.Anzahl / 2);

        this.modalSplitting.open();
    }

    closeModalView(){
        this.modalSplitting.close();
    }
    saveModalView(){
        if(typeof this.splittingAnzahl !== 'number')
            return;

        if(this.splittingAnzahl > 0){
            this.splittingAnzahl = Math.round(this.splittingAnzahl);
            for(var idx in this.produzierbareAuftraege){
                if(this.produzierbareAuftraege[idx].Teil === this.splittingPart){
                    if((this.produzierbareAuftraege[idx].Anzahl - this.splittingAnzahl) > 0){
                        this.produzierbareAuftraege[idx].Anzahl -= this.splittingAnzahl;
                        this.produzierbareAuftraege.splice(Number.parseInt(idx), 0, {"Teil": this.splittingPart, "Anzahl": this.splittingAnzahl});
                    }
                    break;
                }
            }
        }
        this.modalSplitting.close();
    }
    round(anzahl: number){
        return Math.round(anzahl);
    }

    selectedType = "No";


    clickRadio(type){
        this.selectedType = type;
    }

    isSelected(type){
        if(type === this.selectedType){
            return true;
        }
        return false;
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