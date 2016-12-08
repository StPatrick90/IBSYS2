/**
 * Created by Paddy on 07.12.2016.
 */
import {Component} from '@angular/core';
import {SessionService} from '../../../services/session.service';
import {ModalComponent} from 'ng2-bs3-modal/ng2-bs3-modal';
import {Part} from '../../../model/part';
import {PartService} from '../../../services/part.service';
import {
    IMultiSelectOption,
    IMultiSelectSettings,
    IMultiSelectTexts
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';

@Component({
    moduleId: module.id,
    selector: 'partsLists',
    templateUrl: 'partsLists.component.html'
})
export class PartsListsComponent {
    parts: Part[];
    pparts: Part[];
    part: Part = new Part();
    auswahl: any;

    partsList: any = Object();
    nodes: number = 5;

    private productOptions: IMultiSelectOption[] = Array<IMultiSelectOption>();
    private productSettings: IMultiSelectSettings;
    private multiSelectTexts: IMultiSelectTexts;

    constructor(private partservice: PartService, private sessionService: SessionService) {
        if (this.sessionService.getParts() != null || this.sessionService.getParts() != undefined) {
            this.parts = this.sessionService.getParts();
            this.pparts = this.sessionService.getParts().filter(item => item.typ == "P");
            this.initMultiSelects();
        }
        else {
            this.partservice.getParts()
                .subscribe(parts => {
                        this.parts = parts;
                        this.pparts = parts.filter(item => item.typ == "P");
                    },
                    err => console.error(err),
                    () => this.initMultiSelects());
        }
    }

    initMultiSelects() {
        for (let pt of this.pparts) {
            this.productOptions.push({id: pt.nummer, name: pt.bezeichnung.toString()});
        }

        this.productSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: true,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '100px',
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

    generatePartsList(){
        if(this.auswahl != undefined && this.auswahl.length == 1) {
            for (let pt of this.parts) {
                if (pt.nummer == this.auswahl[0]) {
                    this.part = pt;
                }
            }
            if(this.part != null) {
                this.partsList = {
                    _id: this.part._id,
                    bezeichnung: this.part.bezeichnung,
                    typ: this.part.typ,
                    nummer: this.part.nummer,
                    anzahl: 1,
                    bestandteile: []
                };
                for (let best of this.part.bestandteile) {
                    for (let pt of this.parts) {
                        if (best._id == pt._id) {
                            this.partsList.bestandteile.push({
                                _id: pt._id,
                                bezeichnung: pt.bezeichnung,
                                typ: pt.typ,
                                nummer: pt.nummer,
                                anzahl: best.anzahl,
                                bestandteile: this.getBestandteile(pt)
                            })
                        }
                    }
                }
            }
        }
    }

    getBestandteile(part) {
        var bestandteile = Array<any>();
        for (let ptOut of part.bestandteile) {
            for (let ptIn of this.parts) {
                if (ptOut._id == ptIn._id) {
                    bestandteile.push({
                        _id: ptIn._id,
                        bezeichnung: ptIn.bezeichnung,
                        typ: ptIn.typ,
                        nummer: ptIn.nummer,
                        anzahl: ptOut.anzahl,
                        bestandteile: this.getBestandteile(ptIn)
                    })
                }
            }
        }
        return bestandteile;
    }

    getNumber = function(num) {
        return new Array(num);
    }
}