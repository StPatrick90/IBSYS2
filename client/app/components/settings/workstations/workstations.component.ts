/**
 * Created by Paddy on 11.11.2016.
 */
import {Component, ViewChild} from '@angular/core';
import {Workstation} from '../../../model/workstastion';
import {WorkstationService} from '../../../services/workstation.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {isNullOrUndefined} from "util";

@Component({
    moduleId: module.id,
    selector: 'workstations',
    templateUrl: 'workstations.component.html'
})
export class WorkstationsComponent {
    @ViewChild('modalWsExists')
    modalWsExists: ModalComponent;
    @ViewChild('modalWsEmpty')
    modalWsEmpty: ModalComponent;

    workstations: Workstation[];
    _id: string;
    nummer: number;
    name: string;

    constructor(private workstationService: WorkstationService) {
        this.workstationService.getWorkstations()
            .subscribe(workstations => {
                this.workstations = workstations;
            })
    }

    deleteWorkstation(id) {
        var workstations = this.workstations;

        this.workstationService.deleteWorkstation(id)
            .subscribe((data => {
                if (data.n == 1) {
                    for (var i = 0; i < workstations.length; i++) {
                        if (workstations[i]._id == id) {
                            workstations.splice(i, 1);
                        }
                    }
                }
            }))
    }

    updateWorkstation(event) {
        event.preventDefault();
        var workstations = this.workstations;
        var bereitsVorhanden = false;

        for(let ws of workstations){
            if (ws.nummer == this.nummer && ws._id != this._id){
                bereitsVorhanden = true;
            }
        }
        if(!bereitsVorhanden) {
            if (!this._id) {
                var newWorkstation = {
                    nummer: this.nummer,
                    name: this.name
                }
                if(newWorkstation.nummer != null && newWorkstation != null){
                    this.workstationService.addWorkstation(newWorkstation)
                        .subscribe(workstation => {
                            this.workstations.push(workstation);
                            this._id = null;
                            this.nummer = null;
                            this.name = null;
                        });
                }
                else{
                    this.modalWsEmpty.open();
                }


            }
            else {
                var _workstation = {
                    _id: this._id,
                    nummer: this.nummer,
                    name: this.name
                };

                this.workstationService.updateWorkstation(_workstation)
                    .subscribe(data => {
                        if (data.n == 1) {
                            for (var i = 0; i < workstations.length; i++) {
                                if (workstations[i]._id == this._id) {
                                    workstations[i] = _workstation;
                                }
                            }
                        }
                        this._id = null;
                        this.nummer = null;
                        this.name = null;
                    });
            }
        }
        else {
            this.modalWsExists.open();
        }
    }
}