/**
 * Created by Paddy on 11.11.2016.
 */
import { Component } from '@angular/core';
import { Workstation } from '../../../model/workstastion';
import { WorkstationService } from '../../../services/workstation.service';

@Component({
    moduleId: module.id,
    selector: 'workstations',
    templateUrl: 'workstations.component.html'
})
export class WorkstationsComponent{
    workstations: Workstation[];

    constructor(private workstationService:WorkstationService){
        this.workstationService.getWorkstations()
            .subscribe(workstations => {
                this.workstations = workstations;
            })
    }
}