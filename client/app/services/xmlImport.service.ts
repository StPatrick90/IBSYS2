/**
 * Created by philipp.koepfer on 02.11.16.
 */
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Task } from '../../Task';

@Injectable()
export class XmlImportService{

    constructor(private http: Http){
        console.log('XmlImport Service Initialized...');
    }

    convertToJson(xml){
        var xmlneu = {name: xml};
        var headers = new Headers();
        headers.append('Content-Type', 'application/json');
        //console.log(xml);
        return this.http.post('/api/xmlConverter', JSON.stringify(xmlneu), {headers:headers})
            .map(res => res.json());
    }
/*
resultObj = {results:{
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
                all:""}}}}}
*/


}
