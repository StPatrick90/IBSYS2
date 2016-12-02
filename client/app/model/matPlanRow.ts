/**
 * Created by Jonas on 22.11.16.
 */
import {verwendung} from "./verwendung";

export class matPlanRow {
    kpartnr: number;
    lieferfrist: number;
    abweichung: number;
    summe: number;
    verwendung: verwendung[];
    diskontmenge: number;
    anfangsbestand: number;
    bruttobedarfnP: number[];
    mengeohbest: number[];
    bestellmenge: number;
    bestellung: string;
    bestandnWe: number[];

    constructor() {
        this.verwendung = [];
    }

}