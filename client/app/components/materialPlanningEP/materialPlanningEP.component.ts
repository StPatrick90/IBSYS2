/**
 * Created by Paddy on 18.12.2016.
 */
import {Component} from '@angular/core';
import {PartService} from '../../services/part.service';
import {SessionService} from '../../services/session.service';
import {Part} from '../../model/part';
import {
    IMultiSelectOption,
    IMultiSelectSettings,
    IMultiSelectTexts
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';

@Component({
    moduleId: module.id,
    selector: 'materialPlanningEP',
    templateUrl: 'materialPlanningEP.component.html'
})

export class MaterialPlanningEPComponent {
    part: Part;
    eParts: Part[];
    pParts: Part[];
    columns: number = 14;
    auswahl: any;
    partsList: Array<any> = Array<any>();


    private productOptions: IMultiSelectOption[] = Array<IMultiSelectOption>();
    private productSettings: IMultiSelectSettings;
    private multiSelectTexts: IMultiSelectTexts;


    constructor(private partService: PartService, private sessionService: SessionService) {

    }

    ngOnInit() {
        if (this.sessionService.getParts() != null || this.sessionService.getParts() != undefined) {
            this.eParts = this.sessionService.getParts().filter(item => item.typ == "E");
            this.pParts = this.sessionService.getParts().filter(item => item.typ == "P");
            this.initMultiSelects()
        }
        else {
            this.partService.getParts()
                .subscribe(data => {
                        this.eParts = data.filter(item => item.typ == "E");
                        this.pParts = data.filter(item => item.typ == "P");
                    },
                    err => console.error(err),
                    () => this.initMultiSelects());
        }

    }

    initMultiSelects() {
        for (let pt of this.pParts) {
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

    generatePartsList() {
        while (this.partsList.length > 0) {
            this.partsList.pop();
        }
        if (this.auswahl != undefined && this.auswahl.length == 1) {
            for (let pt of this.pParts) {
                if (pt.nummer == this.auswahl[0]) {
                    this.part = pt;
                }
            }

            if (this.part != null) {
                this.partsList.push(this.part);

                for (let best of this.part.bestandteile) {
                    for (let pt of this.eParts) {
                        if (best._id == pt._id) {
                            this.getBestandteile(pt);
                        }
                    }
                }
            }
        }
    }

    getBestandteile(part) {
        this.partsList.push(part);
        if(part.bestandteile && part.bestandteile.length > 0) {
            for (let best of part.bestandteile) {
                for (let pt of this.eParts) {
                    if (best._id == pt._id) {
                        this.getBestandteile(pt);
                    }
                }
            }
        }
    }

    getNumber = function (num) {
        var array = Array<number>();

        for (let i = 1; i <= num; i++) {
            array.push(i);
        }
        return array;

    }


}