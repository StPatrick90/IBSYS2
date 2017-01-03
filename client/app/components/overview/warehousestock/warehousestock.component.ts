/**
 * Created by Paddy on 03.01.2017.
 */
import {Component} from '@angular/core';
import { DBService} from '../../../services/db.service';

@Component({
    moduleId: module.id,
    selector: 'warehousestock',
    templateUrl: 'warehousestock.component.html'
})

export class WarehousestockComponent {
    allResults: any;
    periods = [];
    lineChartLabels : Array<any> = Array<any>();
    lineChartData:Array<any> = [{data: [], label: 'Warehousestock'}];

    constructor(private dbService:DBService){
        dbService.getResults()
            .subscribe(
                results =>{
                    this.allResults = results;
                    for(var i = 0; i <= this.allResults.length-1; i++){
                        if(this.allResults[i].results){
                            this.periods.push(this.allResults[i].results.period);
                        }
                    }
                    this.periods.sort();},
                err => console.log(err),
                () => this.initAll());


    }

    initAll(){
        var data = [];
        for(let p of this.periods){
            this.lineChartLabels.push("Period " + p);
        }
        for(let r of this.allResults){
            data[r.results.period-1] = Number.parseInt(r.results.warehousestock.totalstockvalue);
        }
        this.lineChartData = [{data: data, label: 'Warehousestock'}];
    }


    public lineChartOptions:any = {
        animation: false,
        responsive: true,
        title: {display: true, text:"Lagerbestand", fontSize:30}
    };
    public lineChartColors:Array<any> = [
        { // grey
            backgroundColor: 'rgba(25, 70, 143, 0.2)',
            borderColor: 'rgba(25, 70, 143, 1)',
            pointBackgroundColor: 'rgba(25, 70, 143, 1)',
            pointBorderColor: '#19468f',
            pointHoverBackgroundColor: '#19468f',
            pointHoverBorderColor: 'rgba(25, 70, 143, 0.8)'
        }

    ];
    public lineChartLegend:boolean = false;
    public lineChartType:string = 'line';

}