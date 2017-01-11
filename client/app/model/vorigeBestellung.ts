/**
 * Created by Jonas on 05.01.17.
 */
export class vorigeBestellung {

    teil: string;
    menge: number;
    orderperiode: number;
    ankunftperiode: number;

    constructor() {
        this.menge = 0;
        this.teil = "";
        this.orderperiode = 0;
    }
}