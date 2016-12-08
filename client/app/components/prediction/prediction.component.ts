import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {PredictionService} from '../../services/prediction.service';
import {BindingOrders} from "../../model/bindingOrders";
import {Plannings} from "../../model/plannings";


@Component({
    moduleId: module.id,
    selector: 'prediction',
    templateUrl: 'prediction.component.html'
})
export class PredictionComponent {
    bindingOrders: BindingOrders[];
    plannings: Plannings[];
    sessionService: any;
    resultObjs;
    period: number;
    periods = [];
    sum: number;
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

    constructor(sessionService: SessionService, private predictionService: PredictionService) {
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
        this.bindingOrders = new Array<BindingOrders>();
        this.plannings = new Array<Plannings>();
        console.log(this.plannings);
    }

    ngOnInit() {
        this.predictionService.getBindingOrders()
            .subscribe(bindingOrders => {
                this.bindingOrders = bindingOrders;
            });

        this.predictionService.getPlannings()
            .subscribe(plannings => {
                this.plannings = plannings
                this.generateRowsRemainingStock();
            });
    }

    sumBindingOrders(period: number) {
        for (var i = 0; i < this.bindingOrders.length; i++) {
            if (period == this.bindingOrders[i].period) {
                var p1 = parseInt(this.bindingOrders[i].product1, 10);
                var p2 = parseInt(this.bindingOrders[i].product2, 10);
                var p3 = parseInt(this.bindingOrders[i].product3, 10);
                this.sum = p1 + p2 + p3;
            }
        }
        return this.sum;
    }

    sumPlannedOrders(period: number) {

        for (var i = 0; i < this.plannings.length; i++) {
            if (period == this.plannings[i].period) {
                var p1 = parseInt(this.plannings[i].product1, 10);
                var p2 = parseInt(this.plannings[i].product2, 10);
                var p3 = parseInt(this.plannings[i].product3, 10);
                this.sum = p1 + p2 + p3;
            }
        }
        return this.sum;
    }

    generateRowsRemainingStock() {
        for (var art of this.resultObjs.results.warehousestock.article){
            var _id = parseInt(art.id, 10);
            if (_id == 1) {
                var re = parseInt(this.resultObjs.results.warehousestock.article[0].amount, 10);
                var pl = parseInt(this.plannings[0].product1, 10);
                var bo = parseInt(this.bindingOrders[0].product1, 10);

                this.row1res = re + pl - bo;

                var pl2 = parseInt(this.plannings[1].product1, 10);
                var bo2 = parseInt(this.bindingOrders[1].product1, 10);

                this.row1res2 = this.row1res + pl2 - bo2;

                var pl3 = parseInt(this.plannings[2].product1, 10);
                var bo3 = parseInt(this.bindingOrders[2].product1, 10);

                this.row1res3 = this.row1res2 + pl3 - bo3;

                var pl4 = parseInt(this.plannings[3].product1, 10);
                var bo4 = parseInt(this.bindingOrders[3].product1, 10);

                this.row1res4 = this.row1res3 + pl4 - bo4;
            }else if (_id == 2) {
                var re = parseInt(this.resultObjs.results.warehousestock.article[1].amount, 10);
                var pl = parseInt(this.plannings[0].product2, 10);
                var bo = parseInt(this.bindingOrders[0].product2, 10);

                console.log(this.resultObjs.results.warehousestock.article[1].amount);
                console.log(pl);
                console.log(bo);

                this.row2res = re + pl - bo;

                var pl2 = parseInt(this.plannings[1].product2, 10);
                var bo2 = parseInt(this.bindingOrders[1].product2, 10);

                this.row2res2 = this.row2res + pl2 - bo2;

                var pl3 = parseInt(this.plannings[2].product2, 10);
                var bo3 = parseInt(this.bindingOrders[2].product2, 10);

                this.row2res3 = this.row2res2 + pl3 - bo3;

                var pl4 = parseInt(this.plannings[3].product2, 10);
                var bo4 = parseInt(this.bindingOrders[3].product2, 10);

                this.row2res4 = this.row2res3 + pl4 - bo4;
            }else if (_id == 3) {
                var re = parseInt(this.resultObjs.results.warehousestock.article[2].amount, 10);
                var pl = parseInt(this.plannings[0].product3, 10);
                var bo = parseInt(this.bindingOrders[0].product3, 10);

                this.row3res = re + pl - bo;

                var pl2 = parseInt(this.plannings[1].product3, 10);
                var bo2 = parseInt(this.bindingOrders[1].product3, 10);

                this.row3res2 = this.row3res + pl2 - bo2;

                var pl3 = parseInt(this.plannings[2].product3, 10);
                var bo3 = parseInt(this.bindingOrders[2].product3, 10);

                this.row3res3 = this.row3res2 + pl3 - bo3;

                var pl4 = parseInt(this.plannings[3].product3, 10);
                var bo4 = parseInt(this.bindingOrders[3].product3, 10);

                this.row3res4 = this.row3res3 + pl4 - bo4;
            }
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

    getArticleNumber() {

    }


}

