/**
 * Created by philipp.koepfer on 14.12.16.
 */
import {Workstation} from "./workstastion";
import {Part} from "./part";

export class PrioTask{
    constructor(id: number, start: number, ende: number, aktuellerAp: Workstation, naechsterAp: Workstation, name: string, teil: Part, losgroesse: number, periode: number) {

        this._id = id;
        this.start = start;
        this.ende = ende;
        this.aktuellerAp = aktuellerAp;
        this.naechsterAp = naechsterAp;
        this.name = name;
        this.teil = teil;
        this.losgroesse = losgroesse;
        this.periode = periode;
    }


    _id: number;
    start: number;
    ende: number;
    aktuellerAp: Workstation;
    naechsterAp: Workstation;
    name: string;
    teil: Part;
    losgroesse: number;
    periode: number;
}