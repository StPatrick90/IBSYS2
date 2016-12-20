import {Product} from "./product";

export class BindingOrders{
    //_id: string;
    period: number;
    produkte: Product[];

    constructor() {
        // this.produkte = [];
        this.produkte = new Array<Product>();
    }
}