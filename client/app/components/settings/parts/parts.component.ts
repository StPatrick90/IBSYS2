/**
 * Created by Paddy on 13.11.2016.
 */
import {Component, ViewChild} from '@angular/core';
import {Part} from '../../../model/part';
import {PartService} from '../../../services/part.service';
import {IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';


@Component({
    moduleId: module.id,
    selector: 'parts',
    templateUrl: 'parts.component.html'
})
export class PartsComponent {
    parts: Part[];

    private selectedOptions: number[];
    private typOptions: IMultiSelectOption[] = [
        { id: 1, name: 'K' },
        { id: 2, name: 'D' },
        { id: 3, name: 'H' }
    ];

    private typSettings: IMultiSelectSettings = {
        pullRight: false,
        enableSearch: false,
        checkedStyle: 'glyphicon',
        buttonClasses: 'btn btn-default',
        selectionLimit: 0,
        closeOnSelect: false,
        showCheckAll: true,
        showUncheckAll: true,
        dynamicTitleMaxItems: 3,
        maxHeight: '300px',
    };

    private typTexts: IMultiSelectTexts = {
        checkAll: 'Check all',
        uncheckAll: 'Uncheck all',
        checked: 'checked',
        checkedPlural: 'checked',
        searchPlaceholder: 'Search...',
        defaultTitle: 'Select',
    };

    constructor(private partservice:PartService){
        this.partservice.getParts()
            .subscribe(parts => {
                this.parts = parts;
            })
    }
   /* @ViewChild('modalWsExists')
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
    */
}