/**
 * Created by Paddy on 13.11.2016.
 */
import {Component, ViewChild} from '@angular/core';
import {Part} from '../../../model/part';
import {PartService} from '../../../services/part.service';
import {
    IMultiSelectOption,
    IMultiSelectSettings,
    IMultiSelectTexts
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {Workstation} from "../../../model/workstastion";
import {ProcessingTime} from "../../../model/processingTime";
import { SessionService} from '../../../services/session.service';


@Component({
    moduleId: module.id,
    selector: 'parts',
    templateUrl: 'parts.component.html'
})
export class PartsComponent {
    @ViewChild('modalBestandteile')
    modalBestandteile: ModalComponent;

    private typOptions: IMultiSelectOption[];
    private verwOptions: IMultiSelectOption[];
    private nextWsOptions: IMultiSelectOption[] = Array<IMultiSelectOption>();
    private typSettings: IMultiSelectSettings;
    private verwSettings: IMultiSelectSettings;
    private nextWsSettings: IMultiSelectSettings;
    private multiSelectTexts: IMultiSelectTexts;

    listVerfuegbareTeile: Array<Part> = [];
    listBestandteile: Array<Part> = [];

    part: Part = new Part();
    parts: Part[];
    workstations: Workstation[];
    processingTimes: ProcessingTime[];

    ruestZeit: number[] = Array<number>();
    fertigungsZeit: number[] = Array<number>();

    nextArbeitsplaetze: Workstation[] = Array<Workstation>();

    constructor(private partservice: PartService, private sessionService:SessionService) {
        if(this.sessionService.getWorkstations() != null || this.sessionService.getWorkstations() != undefined ||
            this.sessionService.getParts() != null || this.sessionService.getParts() != undefined ||
            this.sessionService.getProcessingTimes() != null || this.sessionService.getProcessingTimes() != undefined) {
                this.workstations = this.sessionService.getWorkstations();
                this.parts = this.sessionService.getParts();
                this.processingTimes = this.sessionService.getProcessingTimes();
                this.initLists();
        }
        else{
            this.partservice.getWorkstationsAndPartsAndBearbeitung()
                .subscribe(data => {
                        this.workstations = data[0]
                        this.parts = data[1]
                        this.processingTimes = data[2]
                    },
                    err => console.error(err),
                    () => this.initLists());
        }
    }

    initLists() {
        this.fillVerfuegbareTeile();
        this.initMultiSelects();
    }

    initMultiSelects() {
        this.typOptions = [
            {id: 1, name: 'P'},
            {id: 2, name: 'E'},
            {id: 3, name: 'K'}
        ];
        this.verwOptions = [
            {id: 1, name: 'K'},
            {id: 2, name: 'D'},
            {id: 3, name: 'H'}
        ];
        for (let ws of this.workstations) {
            this.nextWsOptions.push({id: ws.nummer, name: ws.nummer.toString()});
        }

        this.typSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: false,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '100px',
        };
        this.verwSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 3,
            closeOnSelect: false,
            showCheckAll: true,
            showUncheckAll: true,
            dynamicTitleMaxItems: 3,
            maxHeight: '300px',
        };
        this.nextWsSettings = {
            pullRight: false,
            enableSearch: true,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: false,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '300px',
        };
        this.multiSelectTexts = {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            defaultTitle: 'Select',
        };
    }

    fillVerfuegbareTeile() {
        if (this.part._id == null) {
            this.listVerfuegbareTeile = this.parts.slice();
        }
        else {
            for (var part of this.parts) {
                if (part._id != this.part._id) {
                    this.listVerfuegbareTeile.push(part);
                }
            }
        }
    }
}