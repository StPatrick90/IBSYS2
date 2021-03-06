/**
 * Created by Paddy on 07.12.2016.
 */
import {Component} from '@angular/core';
import {SessionService} from '../../../services/session.service';
import {Part} from '../../../model/part';
import {PartService} from '../../../services/part.service';
import {
    IMultiSelectOption,
    IMultiSelectSettings,
    IMultiSelectTexts
} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {TranslatePipe}   from '../../../translate/translate.pipe';

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
    columns: number = 0;
    rows: number = 0;
    zeilen: any[] = Array<any>();
    column: number = 1;

    uebersicht: any[] = Array<any>();

    private productOptions: IMultiSelectOption[] = Array<IMultiSelectOption>();
    private productSettings: IMultiSelectSettings;
    private multiSelectTexts: IMultiSelectTexts;

    constructor(private partservice: PartService, private sessionService: SessionService, private translatePipe:TranslatePipe) {
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
            this.productOptions.push({id: pt.nummer, name: this.translatePipe.transform(pt.bezeichnung.toString(),null)});
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
            checkAll: this.translatePipe.transform('combo_checkAll',null),
            uncheckAll: this.translatePipe.transform('combo_uncheckAll',null),
            checked: this.translatePipe.transform('combo_checked',null),
            checkedPlural: this.translatePipe.transform('combo_checkedPlural',null),
            searchPlaceholder: this.translatePipe.transform('combo_searchPlaceholder',null),
            defaultTitle: this.translatePipe.transform('combo_defaultTitle',null),
        };
    }

    generatePartsList() {
        if (this.auswahl != undefined && this.auswahl.length == 1) {
            for (let pt of this.parts) {
                if (pt.nummer == this.auswahl[0]) {
                    this.part = pt;
                }
            }
            var bestandteile = Array<any>();
            if (this.part != null) {
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
                            this.rows++;
                            bestandteile.push({
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
                this.partsList.bestandteile = bestandteile.sort(function (a, b) {
                    var typA = a.typ.toUpperCase();
                    var typB = b.typ.toUpperCase();
                    if (typA > typB) {
                        return -1;
                    }
                    if (typA < typB) {
                        return 1;
                    }
                    if (typA == typB && a.nummer < b.nummer) {
                        return -1
                    }
                    if (typA == typB && a.nummer > b.nummer) {
                        return 1
                    }
                    return 0;
                });
            }
        }
        this.generateRows();
        this.generateUebersicht();
    }

    getBestandteile(part) {
        var bestandteile = Array<any>();
        for (let ptOut of part.bestandteile) {
            for (let ptIn of this.parts) {
                if (ptOut._id == ptIn._id) {
                    this.rows++;
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
        return bestandteile.sort(function (a, b) {
            var typA = a.typ.toUpperCase();
            var typB = b.typ.toUpperCase();
            if (typA > typB) {
                return -1;
            }
            if (typA < typB) {
                return 1;
            }
            if (typA == typB && a.nummer < b.nummer) {
                return -1
            }
            if (typA == typB && a.nummer > b.nummer) {
                return 1
            }
            return 0;
        });
    }

    generateRows() {
        this.columns = 0;
        this.column = 1;
        if (this.zeilen) {
            while (this.zeilen.length > 0) {
                this.zeilen.pop();
            }
        }
        for (let best of this.partsList.bestandteile) {
            this.zeilen.push({teil: best.typ + best.nummer, anzahl: best.anzahl, column: this.column});
            if (best.bestandteile && best.bestandteile.length > 0) {
                this.columns++;
                for (let bt of best.bestandteile) {
                    this.getRows(bt);
                }
            }
        }
    }

    getRows(bestandteil) {
        this.column++;
        this.zeilen.push({teil: bestandteil.typ + bestandteil.nummer, anzahl: bestandteil.anzahl, column: this.column});
        for (let best of bestandteil.bestandteile) {
            this.column++;
            this.zeilen.push({teil: best.typ + best.nummer, anzahl: best.anzahl, column: this.column});
            if (best.bestandteile && best.bestandteile.length > 0) {
                this.columns++;
                for (let bt of best.bestandteile) {
                    this.getRows(bt);

                }
            }
            this.column--;

        }
        this.column--;
    }

    generateUebersicht(){
        var speichern = true;
        if (this.uebersicht) {
            while (this.uebersicht.length > 0) {
                this.uebersicht.pop();
            }
        }

        for(let z of this.zeilen){
            speichern = true;
            for(let u of this.uebersicht){
                if(u.teil == z.teil){
                    u.anzahl+=z.anzahl;
                    speichern = false;
                    break;
                }
            }
            if(speichern) {
                this.uebersicht.push({teil: z.teil, anzahl: z.anzahl});
            }
        }
        this.uebersicht.sort(function (a, b) {
            var typA = a.teil.substring(0,1).toUpperCase();
            var typB = b.teil.substring(0,1).toUpperCase();
            var nummerA = Number.parseInt(a.teil.substring(1));
            var nummerB = Number.parseInt(b.teil.substring(1));
            if (typA < typB) {
                return -1;
            }
            if (typA > typB) {
                return 1;
            }
            if (typA == typB && nummerA < nummerB) {
                return -1
            }
            if (typA == typB && nummerA > nummerB) {
                return 1
            }
            return 0;
        });

        this.uebersicht.unshift({teil: this.part.typ + this.part.nummer, anzahl: 1})
    }

    getNumber = function (num) {
        var array = Array<number>();

        for (let i = 1; i <= num; i++) {
            array.push(i);
        }
        return array;

    }
}