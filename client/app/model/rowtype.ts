import {Product} from "./product";

export class rowtype{
    perioden: number[];
    produkt: Product;

    constructor() {
        this.perioden = new Array<number>();
    }
}