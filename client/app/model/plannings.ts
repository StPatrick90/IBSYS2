import {Product} from "./product";

export class Plannings{
    _id: string;
    period: number;
    produkte: Product[];

    constructor() {
        this.produkte = [];
    }
}