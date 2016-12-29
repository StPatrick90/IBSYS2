/**
 * Created by Paddy on 21.10.2016.
 */
import { Injectable } from '@angular/core';
import {SessionStorage} from "angular2-localstorage/WebStorage";
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Part } from '../model/part';
import { Workstation } from '../model/workstastion';
import { ProcessingTime } from '../model/processingTime';


@Injectable()
export class SessionService{

    @SessionStorage() private resultObj;
    @SessionStorage() private parts : Part[];
    @SessionStorage() private workstations : Workstation[];
    @SessionStorage() private processingTimes : ProcessingTime[];
    @SessionStorage() private partOrders : Array<any>;
    @SessionStorage() private plannedWarehouseStock : Array<any>;

    constructor(private http:Http){
        console.log('Session Service Initialized...');
        this.clear();
    }

    public dummyObj = {results:{
        game:"",
        group:"",
        period:"",
        warehousestock:{
            article:[{id:"",amount:"",startamount:"",pct:"",price:"",stockvalue:""}],
            totalstockvalue:""},

        inwardstockmovement:{
            order:[{orderperiod:"",id:"",mode:"",article:"",amount:"",time:"",materialcosts:"",ordercosts:"",entirecosts:"",piececosts:""}]},

        futureinwardstockmovement:{
            order:[{orderperiod:"",id:"",mode:"",article:"",amount:""}]},

        idletimecosts:{
            workplace:[{id:"",setupevents:"",idletime:"",wageidletimecosts:"",wagecosts:"",machineidletimecosts:""}],
            sum:{setupevents:"",idletime:"",wageidletimecosts:"",wagecosts:"",machineidletimecosts:""}},

        waitinglistworkstations:{
            workplace:[{id:"",timeneed:"",waitinglist:{period:"", order:"", firstbatch:"", lastbatch:"", item:"", amount:"", timeneed:""}}]},

        waitingliststock:{
            missingpart:[{id:"",waitinglist:{period:"",order:"",firstbatch:"",lastbatch:"",item:"",amount:""}}]},

        ordersinwork:{
            workplace:[{id:"",period:"",order:"",batch:"",item:"",amount:"",timeneed:""}]},

        completedorders:{
            order:[{period:"",id:"",item:"",quantity:"",cost:"",averageunitcosts:"", batch:[{id:"",amount:"",cycletime:"",cost:""}]}]},

        cycletimes:{
            startedorders:"",
            waitingorders:"",
            order:[{id:"",period:"",starttime:"",finishtime:"",cycletimemin:"",cycletimefactor:""}]},

        result:{
            general:{
                capacity: {
                    current:"",
                    average:"",
                    all:""},
                possiblecapacity:{
                    current:"",
                    average:"",all:""},
                relpossiblenormalcapacity:{
                    current:"",
                    average:"",
                    all:""},
                productivetime:{
                    current:"",
                    average:"",
                    all:""},
                effiency:{
                    current:"",
                    average:"",
                    all:""},
                sellwish:{
                    current:"",
                    average:"",
                    all:""},
                salesquantity:{
                    current:"",
                    average:"",
                    all:""},
                deliveryreliability:{
                    current:"",
                    average:"",
                    all:""},
                idletime:{
                    current:"",
                    average:"",
                    all:""},
                idletimecosts:{
                    current:"",
                    average:"",
                    all:""},
                storevalue:{
                    current:"",
                    average:"",
                    all:""},
                storagecosts:{
                    current:"",
                    average:"",
                    all:""}},
            defectivegoods:{
                quantity:{
                    current:"",
                    average:"",
                    all:""},
                costs:{
                    current:"",
                    average:"",
                    all:""}},
            normalsale:{
                salesprice:{
                    current:"",
                    average:"",
                    all:""},
                profit:{
                    current:"",
                    average:"",
                    all:""},
                profitperunit:{
                    current:"",
                    average:"",
                    all:""}},
            directsale:{
                profit:{
                    current:"",
                    average:"",
                    all:""},
                contractpenalty:{
                    current:"",
                    average:"",
                    all:""}},
            marketplacesale:{
                profit:{
                    current:"",
                    average:"",
                    all:""}},
            summary:{
                profit:{
                    current:"",
                    average:"",
                    all:""}}}}};

    getResultObject(){
        return (this.resultObj == null || this.resultObj == {})? this.dummyObj: JSON.parse(JSON.stringify(this.resultObj));
    }

    setResultObject(Obj){
        this.resultObj = Obj;
    }
    getParts(){
        return this.parts;
    }
    setParts(parts){
        this.parts = parts;
    }
    getWorkstations(){
        return this.workstations;
    }
    setWorkstations(workstations){
        this.workstations = workstations;
    }
    getProcessingTimes(){
        return this.processingTimes;
    }
    setProcessingTimes(processingTimes){
        this.processingTimes = processingTimes;
    }

    getPartOrders(){
        return this.partOrders;
    }

    setPartOrders(partOrders) {
        this.partOrders = partOrders;
    }
    getPlannedWarehouseStock(){
        return this.plannedWarehouseStock;
    }

    setPlannedWarehouseStock(plannedWarehouseStock) {
        this.plannedWarehouseStock = plannedWarehouseStock;
    }


    clear(){
        this.setResultObject(null);
        this.setParts(null);
        this.setWorkstations(null);
        this.setProcessingTimes(null);
        this.setPartOrders(null);
        this.setPlannedWarehouseStock(null);
    }

}
