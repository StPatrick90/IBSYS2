/**
 * Created by Paddy on 03.11.2016.
 */
import { Component } from '@angular/core';
import { CapacityPlanningService } from '../../services/capacityPlanning.service';
import { Workstation } from '../../model/workstastion';
import { ProcessingTime } from '../../model/processingTime';


@Component({
    moduleId: module.id,
    selector: 'capacityPlanning',
    templateUrl: 'capacityPlanning.component.html'
})

export class CapacityPlanningComponent {
    workstations: Workstation[];
    processingTimes: ProcessingTime[];

    constructor(private capacityPlanningService:CapacityPlanningService){
        this.capacityPlanningService.getWorkstations()
            .subscribe(workstations => {
                this.workstations = workstations;
            });
        this.capacityPlanningService.getProcessingTimes()
            .subscribe(processingTimes => {
                this.processingTimes = processingTimes;
            });
    }

}