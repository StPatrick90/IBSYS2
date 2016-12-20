import {Component} from '@angular/core';
import {SessionService} from '../../services/session.service';
import {PredictionService} from '../../services/prediction.service';
import {DBService} from '../../services/db.service';
import {BindingOrders} from "../../model/bindingOrders";
import {Plannings} from "../../model/plannings";
import Result = jasmine.Result;
import {Product} from "../../model/product";
import {rowtype} from "../../model/rowtype";


@Component({
    moduleId: module.id,
    selector: 'prediction',
    templateUrl: 'prediction.component.html'
})
export class PredictionComponent {
    bindingOrders: BindingOrders[];
    plannings: Plannings[];
    products: Product[];
    bindingtable: BindingOrders[];
    rowtable: rowtype[];
    resultsDb: any;
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
    _produkt: null;

    constructor(sessionService: SessionService, private predictionService: PredictionService, private dbService: DBService) {
        this.sessionService = sessionService;
        this.resultObjs = this.sessionService.getResultObject();
        this.bindingOrders = new Array<BindingOrders>();
        this.plannings = new Array<Plannings>();
        this.bindingtable = new Array<BindingOrders>();
        this.rowtable = new Array<rowtype>();
    }


    ngOnInit() {
        var row = {
            produkt: null,
            produktkennung: "",
            produktmengen: [],
            perioden: []
        };
        this.predictionService.getBindingOrders()
            .subscribe(bindingOrders => {
                this.bindingOrders = bindingOrders;


                for (let i = 0; i < this.bindingOrders.length; i++) {

                    row.produktkennung = this.bindingOrders[i].produkte[i].Kennung;

                    for (let k = 0; k < this.bindingOrders.length; k++) {
                        for (var b of this.bindingOrders[k].produkte) {
                            console.log(b.Kennung);
                            console.log(b.Menge);
                            if (b.Kennung == row.produktkennung) {
                                row.produktmengen.push(b.Menge);
                            }
                        }
                    }
                    this.rowtable.push(row);
                    console.log(row);
                }
                //row.perioden.push(this.bindingOrders[i].period);
            });

        //console.log(this.rowtable);
        }
        //this.sumBindingOrders();
}

