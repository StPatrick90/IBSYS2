/**
 * Created by Paddy on 06.11.2016.
 */
export class Part{
    _id: string;
    nummer: number;
    bezeichnung: string;
    verwendung: string[];
    typ: string;
    wert: number;
    lagerMenge: number;
    bestandteile: Part[];

}