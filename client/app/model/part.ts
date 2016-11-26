/**
 * Created by Paddy on 06.11.2016.
 */
export class Part{
    _id?: string;
    nummer: number;
    bezeichnung: string;
    verwendung: string[];
    typ: any;
    wert: number;
    lagerMenge: number;
    bestandteile: Part[];
    lieferfrist: number;
    abweichung: number;
    diskontmenge: number;
    summe?: number;
}