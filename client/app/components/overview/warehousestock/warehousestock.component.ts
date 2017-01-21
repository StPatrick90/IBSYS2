/**
 * Created by Paddy on 03.01.2017.
 */
import {Component} from '@angular/core';
import { DBService} from '../../../services/db.service';
import {TranslatePipe}   from '../../../translate/translate.pipe';

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

    constructor(private dbService:DBService, private translatePipe:TranslatePipe){
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
        var dataGrenze = [];
        for(let p of this.periods){
            this.lineChartLabels.push(this.translatePipe.transform('overWH_period',null) + " " + p);
        }
        for(let r of this.allResults){
            data[r.results.period-1] = Number.parseInt(r.results.warehousestock.totalstockvalue);
            dataGrenze[r.results.period-1] = 250000;
        }
        this.lineChartData = [{data: data, label: this.translatePipe.transform('overWH_warehousestock',null)},
            {data: dataGrenze, label: this.translatePipe.transform('overWH_limit',null),fill:false}];
    }


    public lineChartOptions:any = {
        animation: false,
        responsive: true
    };
    public lineChartColors:Array<any> = [
        {
            backgroundColor: 'rgba(25, 70, 143, 0.2)',
            borderColor: 'rgba(25, 70, 143, 1)',
            pointBackgroundColor: 'rgba(25, 70, 143, 1)',
            pointBorderColor: '#19468f',
            pointHoverBackgroundColor: '#19468f',
            pointHoverBorderColor: 'rgba(25, 70, 143, 0.8)'
        },
        {
            backgroundColor: 'rgba(255, 0, 0, 0.2)',
            borderColor: 'rgba(255, 0, 0, 1)',
            pointBackgroundColor: 'rgba(255, 0, 03, 1)',
            pointBorderColor: '#ff0000',
            pointHoverBackgroundColor: '#ff0000',
            pointHoverBorderColor: 'rgba(255, 0, 0, 0.8)'
        }

    ];
    public lineChartLegend:boolean = false;
    public lineChartType:string = 'line';

}