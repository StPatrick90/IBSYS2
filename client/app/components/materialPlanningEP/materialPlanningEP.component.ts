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

    //Daten aus ResultObjekt
    resultObj: any;
    warteschlangen: any;
    lager: any;
    bearbeitung: any;

    //Model Daten für Inputs
    auftraegeVerbindl: Array<any> = Array<any>();
    geplLagerbestand: Array<any> = Array<any>();
    lagerbestandVorperiode: Array<any> = Array<any>();
    auftraegeWarteschlAddiert: Array<any> = Array<any>();
    auftraegeWarteschl: Array<any> = Array<any>();
    auftraegeBearb: Array<any> = Array<any>();
    prodAuftraege: Array<any> = Array<any>();


    private productOptions: IMultiSelectOption[] = Array<IMultiSelectOption>();
    private productSettings: IMultiSelectSettings;
    private multiSelectTexts: IMultiSelectTexts;


    //MOCK DATA
    mockVerbindlicheAuftraege: Array<any> = [{id: 1, menge: 100}, {id: 2, menge: 200}, {id: 3, menge: 150}];
    mockGeplLager: Array<any> = [{id: 1, menge: 50}, {id: 2, menge: 60}, {id: 3, menge: 70}];

    constructor(private partService: PartService, private sessionService: SessionService) {

    }

    ngOnInit() {
        if (this.sessionService.getParts() != null || this.sessionService.getParts() != undefined ||
            this.sessionService.getResultObject() != null || this.sessionService.getResultObject() != undefined) {
            this.eParts = this.sessionService.getParts().filter(item => item.typ == "E");
            this.pParts = this.sessionService.getParts().filter(item => item.typ == "P");
            this.resultObj = this.sessionService.getResultObject();
            this.initAll();
        }
        else {
            this.partService.getParts()
                .subscribe(data => {
                        this.eParts = data.filter(item => item.typ == "E");
                        this.pParts = data.filter(item => item.typ == "P");
                    },
                    err => console.error(err),
                    () => this.initAll());
        }


    }

    initAll() {
        this.initMultiSelects();
        this.initVariables();
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

    initArrays() {
        //Verbindliche Aufträge (Produkt 1,2,3) und Addierte Warteschlangen für Produkte 0
        for (let va of this.mockVerbindlicheAuftraege) {
            this.auftraegeVerbindl[va.id] = va.menge;
            this.auftraegeWarteschlAddiert[va.id] = 0;
        }

        //Geplanter Lagerbestand Ende der Periode(Produkt 1,2,3)
        for (let la of this.mockGeplLager) {
            this.geplLagerbestand[la.id] = la.menge;
        }

        //Aufträge in Warteschlange
        for (let workplace of this.warteschlangen.workplace) {
            if (workplace.waitinglist) {
                if (workplace.waitinglist.length !== undefined) {
                    for (let wl of workplace.waitinglist) {
                        if (this.auftraegeWarteschl[Number.parseInt(wl.item)]) {
                            this.auftraegeWarteschl[Number.parseInt(wl.item)] += Number.parseInt(wl.amount);
                        }
                        else {
                            this.auftraegeWarteschl[Number.parseInt(wl.item)] = Number.parseInt(wl.amount);
                        }
                    }
                }
                else {
                    if (this.auftraegeWarteschl[Number.parseInt(workplace.waitinglist.item)]) {
                        this.auftraegeWarteschl[Number.parseInt(workplace.waitinglist.item)] += Number.parseInt(workplace.waitinglist.amount);
                    }
                    else {
                        this.auftraegeWarteschl[Number.parseInt(workplace.waitinglist.item)] = Number.parseInt(workplace.waitinglist.amount);
                    }
                }

            }
        }

        //Lagerbestand Vorperiode
        for (let article of this.lager.article) {
            this.lagerbestandVorperiode[article.id] = article.amount;
        }

        //Aufträge in Bearbeitung
        for (let workplace of this.bearbeitung.workplace) {
            if (this.auftraegeBearb[Number.parseInt(workplace.item)]) {
                this.auftraegeBearb[Number.parseInt(workplace.item)] += Number.parseInt(workplace.amount);
            }
            else {
                this.auftraegeBearb[Number.parseInt(workplace.item)] = Number.parseInt(workplace.amount);
            }
        }

        //Restliche Inputs mit default Werten füllen
        for (let pl of this.partsList) {

            if (!this.auftraegeWarteschl[pl.child.nummer]) {
                this.auftraegeWarteschl[pl.child.nummer] = 0;
            }
            if (!this.auftraegeBearb[pl.child.nummer]) {
                this.auftraegeBearb[pl.child.nummer] = 0;
            }
            if (!this.geplLagerbestand[pl.child.nummer]) {
                this.geplLagerbestand[pl.child.nummer] = 0;
            }

            if (pl.parent) {
                this.auftraegeVerbindl[pl.child.nummer] = this.prodAuftraege[pl.parent.nummer];
                this.auftraegeWarteschlAddiert[pl.child.nummer] = this.auftraegeWarteschl[pl.parent.nummer];
            }
            this.updateArrays(pl.child);
        }
    }

    initVariables() {
        this.warteschlangen = this.resultObj.results.waitinglistworkstations;
        this.lager = this.resultObj.results.warehousestock;
        this.bearbeitung = this.resultObj.results.ordersinwork;
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
                this.partsList.push({child: this.part, parent: null});

                for (let best of this.part.bestandteile) {
                    for (let pt of this.eParts) {
                        if (best._id == pt._id) {
                            this.getBestandteile(pt, this.part);
                        }
                    }
                }
            }
        }
        this.initArrays();
    }

    getBestandteile(child, parent) {
        this.partsList.push({child: child, parent: parent});
        if (child.bestandteile && child.bestandteile.length > 0) {
            for (let best of child.bestandteile) {
                for (let pt of this.eParts) {
                    if (best._id == pt._id) {
                        this.getBestandteile(pt, child);
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

    updateArrays() {
        for (let pt of this.partsList) {
            this.prodAuftraege[pt.child.nummer] =   this.sumProdAuftraege(pt.child) < 0 ? 0 : this.sumProdAuftraege(pt.child);
            if (pt.parent) {
                this.auftraegeVerbindl[pt.child.nummer] = this.prodAuftraege[pt.parent.nummer];
                this.auftraegeWarteschlAddiert[pt.child.nummer] = this.auftraegeWarteschl[pt.parent.nummer];
            }
        }
    }

    sumProdAuftraege(part){
        return this.auftraegeVerbindl[part.nummer] +
        this.auftraegeWarteschlAddiert[part.nummer] + this.geplLagerbestand[part.nummer] -
        this.lagerbestandVorperiode[part.nummer] - this.auftraegeWarteschl[part.nummer] -
        this.auftraegeBearb[part.nummer];
    }

}