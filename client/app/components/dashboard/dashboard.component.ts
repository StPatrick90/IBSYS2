/**
 * Created by philipp.koepfer on 24.11.16.
 */

import { Component, Input, ViewChild } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { DBService} from '../../services/db.service';
import { DashTask } from '../../model/dashTask';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {TranslateService} from "../../translate/translate.service";


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

    dashTaskTypes= ["Warehouse", "Test"];
    selectedType=[];

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
            if(this.selectedType[i] === "Warehouse"){
                this.getStorageValues();
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

    getStorageValues(){

        var storage = [];
        storage = this.resultObj.results.warehousestock.article;

        console.log(this.resultObj);

        for(var i = 0;i < storage.length; i++){
            var amount = parseInt(storage[i].amount , 10);
            var startamount = parseInt(storage[i].startamount , 10);
            if(amount <= (startamount * 0.05)){
                var crit = new DashTask;
                crit.id = this.criticals.length;
                crit.name = "Weniger als 5% im Lager!"
                crit.art = "critical";
                crit.link = "/capacityPlanning"
                crit.article = storage[i].id;
                crit.value = amount;
                this.criticals.push(crit);
                continue;
            }
            if(amount <= (startamount * 0.2)){

                var warn = new DashTask;
                warn.id = this.warnings.length;

                warn.name = this.translation.instant("dashboard_20%capacity");
                warn.art = "warning";
                warn.link = "/capacityPlanning"
                warn.article = storage[i].id;
                warn.value = amount;
                this.warnings.push(warn);
                continue;
            }
            if(amount > startamount){

                var good = new DashTask;
                good.id = this.goods.length;
                good.name = "Mehr als 100% im Lager verfügbar!"
                good.art = "good";
                good.link = "/capacityPlanning"
                good.article = storage[i].id;
                good.value = amount;
                this.goods.push(good);
                continue;
            }

        }
    }
}
