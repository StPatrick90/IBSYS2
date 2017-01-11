import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {PredictionService} from '../../services/prediction.service';
import {DBService} from '../../services/db.service';
import {BindingOrders} from "../../model/bindingOrders";
import {Plannings} from "../../model/plannings";
import Result = jasmine.Result;
import {rowtype} from "../../model/rowtype";


@Component({
    moduleId: module.id,
    selector: 'prediction',
    templateUrl: 'prediction.component.html'
})
export class PredictionComponent {
    bindingOrders: BindingOrders[];
    plannings: Plannings[];
    bindingtable: BindingOrders[];
    rowtable1: rowtype[];
    rowtable2: rowtype[];
    rowtable3: rowtype[];
    results: any;
    sessionService: any;
    resultObjs;
    period: number;
    periods = [];
    produktKennungen = [];


    constructor(sessionService: SessionService, private predictionService: PredictionService, private dbService: DBService) {
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
        this.bindingOrders = new Array<BindingOrders>();
        this.plannings = new Array<Plannings>();
        this.bindingtable = new Array<BindingOrders>();
        this.rowtable1 = new Array<rowtype>();
        this.rowtable2 = new Array<rowtype>();
        this.rowtable3 = new Array<rowtype>();
    }


    ngOnInit() {
        this.dbService.getResults()
            .subscribe(results => {
                this.results = results;
            });

        this.getBindingOrdersAndPlannings();
    }

    getBindingOrdersAndPlannings(){
        this.predictionService.getBindingOrdersAndPlannings()
            .subscribe(data => {
                    this.bindingOrders = data[0]
                    this.plannings = data[1]
                },
                err => console.error(err),
                () => this.generatePlanningsTable(),
                () => this.generateBindingOrdersTable()),
                () => this.generateTableRemainingStock()
    };

    generatePlanningsTable(){
        var produktKennung = this.plannings[0].produkte[0].Kennung;

        for (let i = 0; i < this.plannings[0].produkte.length; i++) {

            var row2 = {
                produkt: null,
                produktkennung: "",
                produktmengen: []
            };

            for (let p of this.plannings) {

                for (let produkt of p.produkte) {
                    if (produkt.Kennung === produktKennung) {
                        row2.produktkennung = produkt.Kennung;
                        row2.produktmengen.push(produkt.Menge);
                        row2.produktkennung = produkt.Kennung;
                    }
                }
            }
            this.rowtable2.push(row2);

            if (i + 1 !== this.plannings[0].produkte.length) {
                produktKennung = this.plannings[0].produkte[i + 1].Kennung;
            }

            this.produktKennungen = this.plannings[0].produkte[i].Kennung;
            console.log(this.produktKennungen);
        }
        this.sessionService.setPlannings(this.rowtable2);
    }

    generateBindingOrdersTable(){
        var produktKennung = this.bindingOrders[0].produkte[0].Kennung;

        for (let i = 0; i < this.bindingOrders[0].produkte.length; i++) {

            var row = {
                produkt: null,
                produktkennung: "",
                produktmengen: []
            };

            for (let bindingOrder of this.bindingOrders) {
                for (let produkt of bindingOrder.produkte) {
                    if (produkt.Kennung === produktKennung) {
                        row.produktkennung = produkt.Kennung;
                        row.produktmengen.push(produkt.Menge);
                    }
                }
            }
            if (i + 1 !== this.bindingOrders[0].produkte.length) {
                produktKennung = this.bindingOrders[0].produkte[i + 1].Kennung;
            }
            this.rowtable1.push(row);
        }
        this.sessionService.setbindingOrders(this.rowtable1);
    }



    generateTableRemainingStock(){
        for(let i = 0; i < this.plannings[0].produkte.length; i++){
            var row3 = {
                produkt: null,
                produktkennung: "",
                produktmengen: []
            }

            row3.produktkennung = this.produktKennungen[i];

            var re = parseInt(this.resultObjs.results.warehousestock.article[i].amount, 10);
            var pl = parseInt(this.plannings[0].produkte[i].menge, 10);
            var bo = parseInt(this.bindingOrders[0].produkte[i].menge, 10);

            var val1 = re + pl - bo;
            row3.produktmengen.push(val1);

            for(let k = 1; k < 3; k++){

                var pl2 = parseInt(this.plannings[k].produkte[i].menge);
                var bo2 = parseInt(this.bindingOrders[k].produkte[i].menge);

                var val2 = val1 + pl2 - bo2;
                row3.produktmengen.push(val2);

                val1 = val2;
            }

            this.rowtable3.push(row3);
        }
    }

    generatePeriods(index: number) {
        this.period = parseInt(this.resultObjs.results.period, 10);
        this.periods.push(this.period);
        this.periods.push(this.period + 1);
        this.periods.push(this.period + 2);
        this.periods.push(this.period + 3);
        return this.periods[index];
    }
}

