/**
 * Created by Paddy on 03.11.2016.
 */
import {Component} from '@angular/core';
import {CapacityPlanningService} from '../../services/capacityPlanning.service';
import {SessionService} from '../../services/session.service';
import {Workstation} from '../../model/workstastion';
import {ProcessingTime} from '../../model/processingTime';
import {Part} from '../../model/part';
import {ProdTime} from '../../model/prodTime';
import {Sequence} from '../../model/sequence';
import {Capacity} from '../../model/capacity';

@Component({
    moduleId: module.id,
    selector: 'capacityPlanning',
    templateUrl: 'capacityPlanning.component.html'
})

export class CapacityPlanningComponent {
    workstations: Workstation[];
    processingTimes: ProcessingTime[];
    parts: Part[];
    artikelListe: ProdTime[] = new Array<ProdTime>();
    partOrders: any;
    reihenfolgen: Array<Sequence>;
    capacities: Array<Capacity> = new Array<Capacity>();
    resultObj: any;
    puffer: Array<number> = new Array<number>();

    constructor(private capacityPlanningService: CapacityPlanningService, private sessionService: SessionService) {
    }

    ngOnInit() {
        this.capacityPlanningService.getWorkstations()
            .subscribe(workstations => {
                this.workstations = workstations;
            });
        this.partOrders = this.sessionService.getPartOrders();
        this.reihenfolgen = this.sessionService.getReihenfolgen();
        this.resultObj = this.sessionService.getResultObject();
        this.getTimesAndEPParts();

    }

    getTimesAndEPParts() {
        this.capacityPlanningService.getTimesAndEPParts().subscribe(
            data => {
                this.processingTimes = data[0]
                this.parts = data[1]
            }
            ,
            err => console.error(err),
            () => this.generateRows())
    };


    generateRows() {
        for (var part of this.parts) {
            var zuweisung: Array<Array<number>> = new Array<Array<number>>();

            for (var pt of this.processingTimes) {
                var apZeit: number[] = [];
                if (pt.teil.nummer === part.nummer) {
                    apZeit.push(pt.arbeitsplatz.nummer);
                    apZeit.push(pt.fertigungsZeit);
                    apZeit.push(pt.ruestZeit);

                    zuweisung.push(apZeit);
                }
            }
            var auftragsMenge = 0;
            for (var partOrder in this.partOrders) {
                var split = partOrder.split("_");
                if (Number.parseInt(split[1]) === part.nummer) {
                    auftragsMenge += Number.parseInt(this.partOrders[partOrder]);
                }
            }


            var prodTime = {
                part: part.nummer,
                zuweisung: zuweisung,
                menge: auftragsMenge
            };
            this.artikelListe.push(prodTime);
        }
        for (let article of this.artikelListe) {
            for (let zw of article.zuweisung) {
                var eingetragen = false;
                for (let cap of this.capacities) {
                    if (cap.workstationNumber === zw[0]) {
                        cap.capacity += zw[1] * article.menge;
                        eingetragen = true;
                    }
                }
                if (!eingetragen) {
                    var cap = {
                        workstationNumber: zw[0],
                        capacity: zw[1] * article.menge,
                        leerzeit: 0,
                        ruestzeit: 0,
                        capacityWait: 0,
                        ruestWait: 0,
                        gesamt: 0,
                        schichten: 0,
                        ueberstunden: 0
                    }
                    this.capacities.push(cap);
                }
            }
        }
        //Kapa, Leerzeiten und Rüstzeiten mit Daten aus der Reihenfolge
        for (let cap of this.capacities) {
            for (let kap of this.reihenfolgen) {
                if (cap.workstationNumber === kap.workstation.nummer) {
                    if (kap.prioTasks.length > 0) {
                        if ((kap.prioTasks[kap.prioTasks.length - 1].ende - kap.ruestzeit - cap.capacity) > 0) {
                            cap.leerzeit = kap.prioTasks[kap.prioTasks.length - 1].ende - kap.ruestzeit - cap.capacity;
                        }
                    }
                    cap.ruestzeit = kap.ruestzeit;
                }
            }
        }

        //Kapa und Rüstzeiten aus den Warteschlangen vor den Arbeitsplätzen
        var warteliste = this.resultObj.results.waitinglistworkstations;

        if(warteliste.workplace) {
            for (let arbeitsplatz of warteliste.workplace) {
                if (arbeitsplatz.waitinglist) {
                    if (arbeitsplatz.waitinglist.length !== undefined) {
                        for (let wl of arbeitsplatz.waitinglist) {
                            this.setWaitingCapacity(arbeitsplatz, wl, true);
                        }
                    }
                    else {
                        this.setWaitingCapacity(arbeitsplatz, arbeitsplatz.waitinglist, true);

                    }
                }
            }
        }

        //Kapa aus den Aufträgen in Bearbeitung
        var bearbeitung = this.resultObj.results.ordersinwork;

        if(bearbeitung.workplace){
            for(let arbeitsplatz of bearbeitung.workplace){
                this.setWaitingCapacity(arbeitsplatz, arbeitsplatz, false);
            }
        }

        //Kapa gesamt + Schichten + Ueberstunden
        for(let cap of this.capacities){
            cap.gesamt = cap.capacity + cap.leerzeit + cap.ruestzeit + cap.capacityWait + cap.ruestWait;
            this.calcShifts(cap);
        }
        this.sessionService.setCapacities(this.capacities);

    }

    setWaitingCapacity(arbeitsplatz ,wait, isWaitinglist){
        for (let pt of this.processingTimes) {
            if (pt.teil.nummer === Number.parseInt(wait.item) && pt.arbeitsplatz.nummer === Number.parseInt(arbeitsplatz.id)) {
                var procTime = pt;
                var weiter = true;
                var firstBearb = true;
                while (weiter) {
                    if (!procTime.nextArbeitsplatz) {
                        weiter = false;
                    }
                    for (let cap of this.capacities) {
                        if (cap.workstationNumber === procTime.arbeitsplatz.nummer) {
                            if(isWaitinglist){
                                cap.capacityWait += procTime.fertigungsZeit * Number.parseInt(wait.amount);
                                cap.ruestWait += procTime.ruestZeit;
                            }
                            else{
                                if(firstBearb){
                                    cap.capacityWait += Number.parseInt(wait.timeneed);
                                    firstBearb = false;
                                }
                                else{
                                    cap.capacityWait += procTime.fertigungsZeit * Number.parseInt(wait.amount);
                                    cap.ruestWait += procTime.ruestZeit;
                                }
                            }
                            break;
                        }
                    }
                    if (weiter) {
                        for (let pTime of this.processingTimes) {
                            if (pTime.teil.nummer === Number.parseInt(wait.item) && pTime.arbeitsplatz.nummer === procTime.nextArbeitsplatz.nummer) {
                                procTime = pTime;
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    calcShifts(cap){
        if(cap.gesamt <= 7200){
            if(cap.gesamt <= 6000){
                if(cap.gesamt <= 4800){
                    if(cap.gesamt <= 3600){
                        if(cap.gesamt <= 2400){
                            cap.schichten = 1;
                            cap.ueberstunden = 0;
                        }
                        else{
                            cap.schichten = 1;
                            cap.ueberstunden = Math.ceil((cap.gesamt-2400)/5);
                        }
                    }
                    else{
                        cap.schichten = 2;
                        cap.ueberstunden = 0;
                    }
                }
                else{
                    cap.schichten = 2;
                    cap.ueberstunden = Math.ceil((cap.gesamt-4800)/5);
                }
            }
            else{
                cap.schichten = 3;
                cap.ueberstunden = 0;
            }
        }
        else{
            cap.schichten = 3;
            cap.ueberstunden = 0;
        }
    }

    updateShifts(workstationNumber){
        for(let cap of this.capacities){
            if(cap.workstationNumber === workstationNumber){
                cap.gesamt = cap.capacity + cap.leerzeit + cap.ruestzeit + cap.capacityWait + cap.ruestWait + this.puffer[workstationNumber];
                this.calcShifts(cap);
                this.sessionService.setCapacities(this.capacities);
                break;
            }
        }
    }
}