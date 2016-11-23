/**
 * Created by Jonas on 22.11.16.
 */

export class matPlanRow {
    kpartnr: number;
    lieferfrist: number;
    abweichung: number;
    summe: number;
    verwendung: string[];
    diskontmenge: number;
    anfangsbestand: number;
    bruttobedarfnP: number[];
    mengeohbest: number[];
    bestellmenge: number;
    bestellung: string;
    bestandnWe: number[];

    constructor () {
        this.verwendung = [];
    }

}