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

    listVerfuegbareTeile: Part[] = Array<Part>();
    listBestandteile: Part[] =  Array<Part>();

    part: Part = new Part();
    parts: Part[];
    workstations: Workstation[];
    processingTimes: ProcessingTime[];

    ruestZeit: number[] = Array<number>();
    fertigungsZeit: number[] = Array<number>();
    checkedAP: boolean[] = Array<boolean>();

    anzahl: number[] = Array<number>();
    checkedParts: boolean[] = Array<boolean>();

    nextArbeitsplaetze: number[] = Array<number>();

    lastId: string;

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
        this.initCheckboxes();
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

    initCheckboxes(){
        for(var ws of this.workstations){
            this.checkedAP[ws.nummer] = false;
        }
        for(var part of this.parts){
            this.checkedAP[part.nummer] = false;
        }
    }

    updatePart(event){
        event.preventDefault();
        var bereitsVorhanden = false;

        for(let pts of this.parts){
            if (pts.nummer == this.part.nummer && pts._id != this.part._id){
                bereitsVorhanden = true;
            }
        }
        if(!bereitsVorhanden) {
            if (!this.part._id) {
                var newPart = {
                    nummer: this.part.nummer,
                    bezeichnung: this.part.bezeichnung,

                }
                if(newPart.nummer != null && newPart.bezeichnung != null){
                    this.workstationService.addWorkstation(newWorkstation)
                        .subscribe(workstation => {
                            this.workstations.push(workstation);
                            this.sessionService.setWorkstations(workstations);
                            this.resetWorkstation();
                        });
                }
                else{
                    this.modalWsEmpty.open();
                }


            }
            /*
            else {
                this.workstationService.updateWorkstation(this.workstation)
                    .subscribe(data => {
                        if (data.n == 1) {
                            for (var i = 0; i < workstations.length; i++) {
                                if (workstations[i]._id == this.workstation._id) {
                                    workstations[i] = this.workstation;
                                    this.sessionService.setWorkstations(workstations);
                                }
                            }
                        }
                        this.resetWorkstation();
                    });
            }
             */
        }
        /*
        else {
            this.modalWsExists.open();
        }
         */
    }

    updateCheckedStatus(mode,item){
        if(mode == 1) {
            this.checkedAP[item.nummer] = !this.checkedAP[item.nummer];
        }
        if(mode == 2){
            this.checkedParts[item.nummer] = !this.checkedParts[item.nummer];
        }
    }

    test(){
        var verwendung = [];
        var bestandteile = [];
        var typ;

        if(this.part.verwendung) {
            for (var verw of this.part.verwendung) {
                verwendung.push(verw == "1" ? "K" : verw == "2" ? "D" : "H")
            }
            verwendung = verwendung.sort((s1, s2) => {
                if (s1 > s2) {
                    return 1;
                }
                if (s1 < s2) {
                    return -1;
                }
                return 0;
            })
        }
        for(var i = 0; i < this.checkedParts.length -1; i++) {
            if (this.checkedParts[i]) {
                bestandteile.push({
                    _id: this.parts.find(part => part.nummer == i)._id,
                    anzahl: this.anzahl[i] ? this.anzahl[i] : 0
                });
            }
        }

        if(this.part.typ) {
            typ = this.part.typ[0] == "1" ? "P" : this.part.typ[0] == "2" ? "E" : "K";
        }


        var newPart : Part = {
            nummer: this.part.nummer,
            bezeichnung: this.part.bezeichnung,
            verwendung: verwendung,
            typ: typ,
            wert: this.part.wert,
            lagerMenge: this.part.lagerMenge,
            bestandteile: bestandteile,
            lieferfrist: this.part.lieferfrist,
            abweichung: this.part.abweichung,
            diskontmenge: this.part.diskontmenge
        }

        this.partservice.addPart(newPart)
            .subscribe(part => {
                this.parts.push(part);
                this.lastId = part._id;
            }
                ,
                err => console.error(err),
                () => this.addProcessingTime());

    }
    addProcessingTime(){
        var bearbeitungsZeiten = [];

        for(var i = 0; i < this.checkedAP.length -1; i++){
            if(this.checkedAP[i]){
                var bearbeitungsZeit  = {
                    arbeitsplatz: 'ObjectId("' + this.workstations.find(ws => ws.nummer == i)._id + '")',
                    teil: 'ObjectId("' + this.lastId + '")',
                    ruestZeit:this.ruestZeit[i] ? this.ruestZeit[i] : 0,
                    fertigungsZeit: this.fertigungsZeit[i] ? this.fertigungsZeit[i] : 0,
                    nextArbeitsplatz: this.workstations.find(ws => ws.nummer == this.nextArbeitsplaetze[i]) ?
                    'ObjectId("' + this.workstations.find(ws => ws.nummer == this.nextArbeitsplaetze[i])._id + '")'
                        : null
                }
                bearbeitungsZeiten.push(bearbeitungsZeit);
            }
        }
        this.partservice.addProcessingTimes(bearbeitungsZeiten)
            .subscribe(ba => {
                console.log(ba);
            }
            ,
            err => console.error(err));
    }
}