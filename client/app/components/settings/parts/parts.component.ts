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
    private typOptions: IMultiSelectOption[];
    private verwOptions: IMultiSelectOption[];
    private bestOptions: IMultiSelectOption[];
    private typSettings: IMultiSelectSettings;
    private verwSettings: IMultiSelectSettings;
    private bestSettings: IMultiSelectSettings;
    private multiSelectTexts: IMultiSelectTexts;

    parts: Part[];

    constructor(private partservice:PartService){
        this.partservice.getParts()
            .subscribe(parts => {
                this.parts = parts;
            },
            err => console.error(err),
            () => this.fillBestandteileCombo())
        this.initMultiSelects();
    }
    initMultiSelects(){
        this.typOptions = [
            { id: 1, name: 'P' },
            { id: 2, name: 'E' },
            { id: 3, name: 'K' }
        ];
        this.verwOptions = [
            { id: 1, name: 'K' },
            { id: 2, name: 'D' },
            { id: 3, name: 'H' }
        ];
        this.bestOptions = [];
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
        this.bestSettings = {
            pullRight: false,
            enableSearch: true,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 0,
            closeOnSelect: false,
            showCheckAll: true,
            showUncheckAll: true,
            dynamicTitleMaxItems: 1,
            maxHeight: '500px',
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
    fillBestandteileCombo(){
        var id = 1;
        for(var part of this.parts){
            this.bestOptions.push({id: id, name: part.bezeichnung + ' - ' + part.verwendung.toString()});
            id++;
        }
    }
}