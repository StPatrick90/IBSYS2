/**
 * Created by philipp.koepfer on 14.12.16.
 */
import {Workstation} from "./workstastion";
import {Part} from "./part";

export class PrioTask{
    _id: string;
    start: number;
    ende: number;
    aktuellerAp: Workstation;
    naechsterAp: Workstation;
    name: string;
    teil: Part;
    losgroesse: number;
    periode: number;
}