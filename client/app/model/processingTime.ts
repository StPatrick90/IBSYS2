/**
 * Created by Paddy on 06.11.2016.
 */
import {Workstation} from "./workstastion";
import {Part} from "./part";

export class ProcessingTime{
    _id?: string;
    arbeitsplatz: Workstation;
    teil: Part;
    ruestZeit: number;
    fertigungsZeit: number;
    nextArbeitsplatz: Workstation;
}