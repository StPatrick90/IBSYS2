/**
 * Created by philipp.koepfer on 21.12.16.
 */
import {Workstation} from "./workstastion";
import {PrioTask} from "./prioTask";


export class Sequence{
    workstation: Workstation;
    prioTasks : Array<PrioTask>;
}