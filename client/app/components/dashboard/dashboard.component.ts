/**
 * Created by philipp.koepfer on 24.11.16.
 */

import { Component, Input, ViewChild } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { DBService} from '../../services/db.service';
import { DashTask } from '../../model/dashTask';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {TranslateService} from "../../translate/translate.service";
import {start} from "repl";


@Component({
    moduleId: module.id,
    selector: 'xmlImport',
    templateUrl: 'dashboard.component.html'
})
export class DashboardComponent {

    resultObj: any;
    allResults = [];

    normals: DashTask[];
    criticals: DashTask[];
    warnings: DashTask[];
    goods: DashTask[];

    @ViewChild('configuration')
    modalConfig: ModalComponent;

    dashTaskTypes= [];
    selectedType= [];

    constructor(sessionService: SessionService, dbService: DBService, private translation: TranslateService){

        this.resultObj = sessionService.getResultObject();
        this.warnings = [];
        this.normals = [];
        this.goods = [];
        this.criticals = [];
        dbService.getResults()
            .subscribe(
                results =>{this.allResults = results;},
                err => console.log(err),
                () => console.log("Periods loaded!"));

        this.dashTaskTypes.push(this.translation.instant('dashboard_warehouse'));
        this.dashTaskTypes.push(this.translation.instant('dashboard_deliver'));
        this.selectedType.push(this.translation.instant('dashboard_warehouse'));
        this.selectedType.push(this.translation.instant('dashboard_deliver'));
        this.bootstrapDashTasks();
    }

    setConfig(){
        this.modalConfig.open();
    }

    closeConfig(){
        this.bootstrapDashTasks();
        this.modalConfig.close();
    }

    bootstrapDashTasks(){
        this.warnings.length = 0;
        this.normals.length = 0;
        this.goods.length = 0;
        this.criticals.length = 0;

        for(var i = 0; i < this.selectedType.length; i++){
            if(this.selectedType[i] === "Warehouse" || this.selectedType[i] === "Lager"){
                this.getStorageValues();
            }
            if(this.selectedType[i] === "Delivery Reliability" || this.selectedType[i] === "Liefertreue"){
                this.getDeliveryreliability();
            }
        }
    }

    clickRadio(type){
        for(var i = 0; i < this.selectedType.length; i++){
            if(type == this.selectedType[i]){
                this.selectedType.splice(i, 1);
                return;
            }
        }
        this.selectedType.push(type);
    }

    isSelected(type){
        for(var i = 0; i < this.selectedType.length; i++){
            if(type == this.selectedType[i])
                return true;
        }
        return false;
    }

    deleteClicked(dashTask: DashTask){
        if(dashTask.art == "critical"){
            var index = this.criticals.indexOf(dashTask);
            this.criticals.splice(index, 1);
        }
        if(dashTask.art == "warning"){
            var index = this.criticals.indexOf(dashTask);
            this.warnings.splice(index, 1);
        }
        if(dashTask.art == "good"){
            var index = this.criticals.indexOf(dashTask);
            this.goods.splice(index, 1);
        }
    }

    getDeliveryreliability(){
        var warnValue = 0.99;
        var goodValue = 1;

        var deliveryObject = this.resultObj.results.result.general.deliveryreliability;
        var currentString = deliveryObject.current.slice(0, -1);
        var current = parseInt(currentString);

        if(current >= goodValue){
            var good = new DashTask();
            good.art = "good";
            good.from = "deliveryreliability";
            good.link = "/prediction";
            good.displayValue = deliveryObject.current;
            good.id = this.goods.length;

            this.goods.push(good);
            return;
        }
        if(current >= warnValue){
            var warn = new DashTask();
            warn.art = "warning";
            warn.from = "deliveryreliability";
            warn.link = "/prediction";
            warn.displayValue = deliveryObject.current;
            warn.id = this.goods.length;

            this.warnings.push(warn);
            return;
        }
        if(current){
            var crit = new DashTask();
            crit.art = "critical";
            crit.from = "deliveryreliability";
            crit.link = "/prediction";
            crit.displayValue = deliveryObject.current;
            crit.id = this.goods.length;

            this.criticals.push(crit);
            return;
        }
    }


    getStorageValues(){
        var storage = [];
        storage = this.resultObj.results.warehousestock.article;

        var critValue = 0.05;
        var warnValue = 0.2;
        //goodValue = startamount

        for(var i = 0;i < storage.length; i++){
            var amount = parseInt(storage[i].amount , 10);
            var startamount = parseInt(storage[i].startamount , 10);
            if(amount <= (startamount * critValue)){
                var crit = new DashTask;
                crit.id = this.criticals.length;
                crit.displayValue = critValue.toString();
                crit.art = "critical";
                crit.link = "/capacityPlanning"
                crit.article = storage[i].id;
                crit.value = amount;
                crit.from = "warehousestock";
                this.criticals.push(crit);
                continue;
            }
            if(amount <= (startamount * warnValue)){

                var warn = new DashTask;
                warn.id = this.warnings.length;
                warn.displayValue = warnValue.toString();
                warn.art = "warning";
                warn.link = "/capacityPlanning"
                warn.article = storage[i].id;
                warn.value = amount;
                warn.from = "warehousestock";
                this.warnings.push(warn);
                continue;
            }
            if(amount > startamount){

                var good = new DashTask;
                good.id = this.goods.length;
                good.displayValue = (Math.floor(((amount / startamount) * 100))/100).toString();
                good.art = "good";
                good.link = "/capacityPlanning"
                good.article = storage[i].id;
                good.value = amount;
                good.from = "warehousestock";
                this.goods.push(good);
                continue;
            }

        }
    }
}
