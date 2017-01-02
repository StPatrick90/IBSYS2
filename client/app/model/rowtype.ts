import {Product} from "./product";

export class rowtype{
    perioden: number[];
    produkt: Product;
    period: number;
    produktkennung: string;
    produktmengen: number[];

    constructor() {
        this.perioden = new Array<number>();
    }
}