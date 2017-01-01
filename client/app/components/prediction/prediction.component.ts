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
    results: any;
    sessionService: any;
    resultObjs;
    period: number;
    periods = [];
    sumsBo = [];
    sumsPl = [];
    row1res: number;
    row1res2: number;
    row1res3: number;
    row1res4: number;
    row2res: number;
    row2res2: number;
    row2res3: number;
    row2res4: number;
    row3res: number;
    row3res2: number;
    row3res3: number;
    row3res4: number;

    constructor(sessionService: SessionService, private predictionService: PredictionService, private dbService: DBService) {
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
        this.bindingOrders = new Array<BindingOrders>();
        this.plannings = new Array<Plannings>();
        this.bindingtable = new Array<BindingOrders>();
        this.rowtable1 = new Array<rowtype>();
        this.rowtable2 = new Array<rowtype>()
    }


    ngOnInit() {
        this.predictionService.getBindingOrders()
            .subscribe(bindingOrders => {
                this.bindingOrders = bindingOrders;
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
                console.log("rt1", this.rowtable1);
            });

        //TODO: Methoden für Rechnungen umbasteln - ab hier alles unused ATM außer generatePeriods

        this.predictionService.getPlannings()
            .subscribe(plannings => {
                this.plannings = plannings;

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
                            }
                        }
                    }
                    if (i + 1 !== this.plannings[0].produkte.length) {
                        produktKennung = this.plannings[0].produkte[i + 1].Kennung;
                    }
                    this.rowtable2.push(row2);
                }
                this.sessionService.setPlannings(this.rowtable2);
                console.log("rt2", this.rowtable2);

                // this.generateRowsRemainingStock();

            });

        this.dbService.getResults()
            .subscribe(results => {
                this.results = results;
            });
    }

    // sumBindingOrders() {
    //     this.period = parseInt(this.resultObjs.results.period, 10);
    //     this.periods.push(this.period);
    //     this.periods.push(this.period + 1);
    //     this.periods.push(this.period + 2);
    //     this.periods.push(this.period + 3);
    //
    //     for (var i = 0; i < this.bindingOrders.length; i++) {
    //         if (this.periods[i] == this.bindingOrders[i].period) {
    //             var p1 = parseInt(this.bindingOrders[i].product1, 10);
    //             var p2 = parseInt(this.bindingOrders[i].product2, 10);
    //             var p3 = parseInt(this.bindingOrders[i].product3, 10);
    //             var sumBo = p1 + p2 + p3;
    //             this.sumsBo.push(sumBo);
    //         }
    //     }
    // }

    // sumPlannedOrders() {
    //     this.period = parseInt(this.resultObjs.results.period, 10);
    //     this.periods.push(this.period);
    //     this.periods.push(this.period + 1);
    //     this.periods.push(this.period + 2);
    //     this.periods.push(this.period + 3);
    //
    //     for (var i = 0; i < this.plannings.length; i++) {
    //         if (this.periods[i] == this.plannings[i].period) {
    //             var p1 = parseInt(this.plannings[i].product1, 10);
    //             var p2 = parseInt(this.plannings[i].product2, 10);
    //             var p3 = parseInt(this.plannings[i].product3, 10);
    //             var sumPl = p1 + p2 + p3;
    //             this.sumsPl.push(sumPl);
    //         }
    //     }
    // }

    // generateRowsRemainingStock() {
    //     for (var art of this.resultObjs.results.warehousestock.article) {
    //         var _id = parseInt(art.id, 10);
    //         if (_id == 1) {
    //             var re = parseInt(this.resultObjs.results.warehousestock.article[0].amount, 10);
    //             var pl = parseInt(this.plannings[0].product1, 10);
    //             var bo = parseInt(this.bindingOrders[0].product1, 10);
    //
    //
    //             this.row1res = re + pl - bo;
    //
    //             var pl2 = parseInt(this.plannings[1].product1, 10);
    //             var bo2 = parseInt(this.bindingOrders[1].product1, 10);
    //
    //             this.row1res2 = this.row1res + pl2 - bo2;
    //
    //             var pl3 = parseInt(this.plannings[2].product1, 10);
    //             var bo3 = parseInt(this.bindingOrders[2].product1, 10);
    //
    //             this.row1res3 = this.row1res2 + pl3 - bo3;
    //
    //             var pl4 = parseInt(this.plannings[3].product1, 10);
    //             var bo4 = parseInt(this.bindingOrders[3].product1, 10);
    //
    //             this.row1res4 = this.row1res3 + pl4 - bo4;
    //         } else if (_id == 2) {
    //             var re = parseInt(this.resultObjs.results.warehousestock.article[1].amount, 10);
    //             var pl = parseInt(this.plannings[0].product2, 10);
    //             var bo = parseInt(this.bindingOrders[0].product2, 10);
    //
    //             this.row2res = re + pl - bo;
    //
    //             var pl2 = parseInt(this.plannings[1].product2, 10);
    //             var bo2 = parseInt(this.bindingOrders[1].product2, 10);
    //
    //             this.row2res2 = this.row2res + pl2 - bo2;
    //
    //             var pl3 = parseInt(this.plannings[2].product2, 10);
    //             var bo3 = parseInt(this.bindingOrders[2].product2, 10);
    //
    //             this.row2res3 = this.row2res2 + pl3 - bo3;
    //
    //             var pl4 = parseInt(this.plannings[3].product2, 10);
    //             var bo4 = parseInt(this.bindingOrders[3].product2, 10);
    //
    //             this.row2res4 = this.row2res3 + pl4 - bo4;
    //         } else if (_id == 3) {
    //             var re = parseInt(this.resultObjs.results.warehousestock.article[2].amount, 10);
    //             var pl = parseInt(this.plannings[0].product3, 10);
    //             var bo = parseInt(this.bindingOrders[0].product3, 10);
    //
    //             this.row3res = re + pl - bo;
    //
    //             var pl2 = parseInt(this.plannings[1].product3, 10);
    //             var bo2 = parseInt(this.bindingOrders[1].product3, 10);
    //
    //             this.row3res2 = this.row3res + pl2 - bo2;
    //
    //             var pl3 = parseInt(this.plannings[2].product3, 10);
    //             var bo3 = parseInt(this.bindingOrders[2].product3, 10);
    //
    //             this.row3res3 = this.row3res2 + pl3 - bo3;
    //
    //             var pl4 = parseInt(this.plannings[3].product3, 10);
    //             var bo4 = parseInt(this.bindingOrders[3].product3, 10);
    //
    //             this.row3res4 = this.row3res3 + pl4 - bo4;
    //         }
    //     }
    // }

    // generatePeriods(index: number) {
    //     this.period = parseInt(this.resultObjs.results.period, 10);
    //     this.periods.push(this.period);
    //     this.periods.push(this.period + 1);
    //     this.periods.push(this.period + 2);
    //     this.periods.push(this.period + 3);
    //     return this.periods[index];
    // }
}

