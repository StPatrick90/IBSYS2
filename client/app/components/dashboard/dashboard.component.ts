/**
 * Created by philipp.koepfer on 24.11.16.
 */

import { Component, Input } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { DBService} from '../../services/db.service';
import { DashTask } from '../../model/dashTask';

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

    constructor(sessionService: SessionService, dbService: DBService){

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

        this.getStorageValues();
    }

   /*+ function(){
    $('.clickable').on('click',function(){
        var effect = $(this).data('effect');
        $(this).closest('.panel')[effect]();
    })
})*/

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
            if(amount <= (startamount * 0.1)){

                var crit = new DashTask;
                crit.id = this.criticals.length;
                crit.name = "Weniger als 10% im Lager!"
                crit.art = "critical";
                crit.link = "/capacityPlanning"
                crit.value = amount;
                this.criticals.push(crit);
                continue;
            }
            if(amount <= (startamount * 0.4)){

                var warn = new DashTask;
                warn.id = this.warnings.length;
                warn.name = "Weniger als 40% im Lager!"
                warn.art = "warning";
                warn.link = "/capacityPlanning"
                warn.value = amount;
                this.warnings.push(warn);
                continue;
            }
            if(amount >= startamount){

                var good = new DashTask;
                good.id = this.goods.length;
                good.name = "100% und mehr im Lager verfügbar!"
                good.art = "good";
                good.link = "/capacityPlanning"
                good.value = amount;
                this.goods.push(good);
                continue;
            }

        }
    }
}
