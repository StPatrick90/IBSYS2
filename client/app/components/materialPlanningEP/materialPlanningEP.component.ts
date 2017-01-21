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
import {Forecast} from '../../model/forecast';
import {TranslatePipe}   from '../../translate/translate.pipe';

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
    tmp_partsList: Array<any> = Array<any>();
    partsListSingle: Array<any> = Array<any>();

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

    forecast: Forecast;
    period: number = 0;

    //Forecast Data
    forecastVerbindlicheAuftraege: Array<any> = new Array<any>();
    forecastGeplLager: Array<any> = new Array<any>();

    constructor(private partService: PartService, private sessionService: SessionService, private translatePipe:TranslatePipe) {
    }

    ngOnInit() {
        this.sessionService.setfromothercomp(true);

        if (this.sessionService.getResultObject()) {
            this.period = Number.parseInt(this.sessionService.getResultObject().results.period);
        }
        if (this.sessionService.getForecast()) {
            this.forecast = this.sessionService.getForecast();

            if (this.forecast.period === this.period) {
                for (let article of this.forecast.article) {
                    for (let vA of article.verbdindlicheAuftraege) {
                        if (vA.periode === this.period) {
                            this.forecastVerbindlicheAuftraege.push({id: article.partNr, menge: vA.anzahl + article.direktVerkauf.menge});
                        }
                    }
                    for (let vB of article.voraussichtlicherBestand) {
                        if (vB.periode === this.period) {
                            this.forecastGeplLager.push({id: article.partNr, menge: vB.anzahl});
                        }
                    }

                }
            }

        }

        if (this.sessionService.getParts() || this.sessionService.getResultObject()) {
            this.eParts = this.sessionService.getParts().filter(item => item.typ == "E");
            this.pParts = this.sessionService.getParts().filter(item => item.typ == "P");
            this.resultObj = this.sessionService.getResultObject();
            if (this.sessionService.getPlannedWarehouseStock()) {
                this.geplLagerbestand = this.sessionService.getPlannedWarehouseStock();
            }
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
        this.generatePartsList();
    }

    initMultiSelects() {
        for (let pt of this.pParts) {
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

    initArrays() {
        while (this.auftraegeWarteschl && this.auftraegeWarteschl.length > 0) {
            this.auftraegeWarteschl.pop();
        }
        while (this.auftraegeBearb && this.auftraegeBearb.length > 0) {
            this.auftraegeBearb.pop();
        }

        //Verbindliche Aufträge (Produkt 1,2,3) und Addierte Warteschlangen für Produkte 0
        for (let va of this.forecastVerbindlicheAuftraege) {
            if (this.part.nummer === va.id) {
                if (!this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + va.id]) {
                    this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + va.id] = va.menge;
                }
                if (!this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + va.id]) {
                    this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + va.id] = 0;
                }
            }
        }

        //Geplanter Lagerbestand Ende der Periode(Produkt 1,2,3)
        for (let la of this.forecastGeplLager) {
            if (this.part.nummer === la.id) {
                if (!this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + la.id]) {
                    this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + la.id] = la.menge;
                }
                for (let pl of this.tmp_partsList) {
                       if(pl.teil.child.nummer !== la.id && !this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer]){
                           this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = la.menge;
                       }
                }
            }
        }

        //Aufträge in Warteschlange
        for (let workplace of this.warteschlangen.workplace) {
            if (workplace.waitinglist) {
                if (workplace.waitinglist.length !== undefined) {
                    for (let wl of workplace.waitinglist) {
                        for (let pl of this.tmp_partsList) {
                            if (pl.teil.child.nummer === Number.parseInt(wl.item)) {
                                if (this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)]) {
                                    this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)] += Number.parseInt(wl.amount);
                                }
                                else {
                                    this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(wl.item)] = Number.parseInt(wl.amount);
                                }
                            }
                        }
                    }
                }
                else {
                    for (let pl of this.tmp_partsList) {
                        if (pl.teil.child.nummer === Number.parseInt(workplace.waitinglist.item)) {
                            if (this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)]) {
                                this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)] += Number.parseInt(workplace.waitinglist.amount);
                            }
                            else {
                                this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.waitinglist.item)] = Number.parseInt(workplace.waitinglist.amount);
                            }
                        }
                    }
                }
            }
        }

        //Lagerbestand Vorperiode
        for (let article of this.lager.article) {
            for (let pl of this.tmp_partsList) {
                if (pl.teil.child.nummer === Number.parseInt(article.id)) {
                    if (this.isGleichTeil(article.id)) {
                        this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + article.id] = (article.amount / 3).toFixed(2);
                    }
                    else {
                        this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + article.id] = article.amount;
                    }
                }
            }
        }

        //Aufträge in Bearbeitung
        for (let workplace of this.bearbeitung.workplace) {
            for (let pl of this.tmp_partsList) {
                if (pl.teil.child.nummer === Number.parseInt(workplace.item)) {
                    if (this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)]) {
                        this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)] += Number.parseInt(workplace.amount);
                    }
                    else {
                        this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + Number.parseInt(workplace.item)] = Number.parseInt(workplace.amount);
                    }
                }
            }
        }

        //Restliche Inputs mit default Werten füllen
        for (let pl of this.tmp_partsList) {
            if (!this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer]) {
                this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = 0;
            }
            if (!this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer]) {
                this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = 0;
            }
            if (!this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer]) {
                this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = 0;
            }

            if (pl.parent) {
                this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pl.teil.parent.nummer];
                this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + pl.teil.child.nummer] = this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pl.teil.parent.nummer];
            }
            this.updateArrays(true);
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

        for (let pt of this.pParts) {
            this.part = pt;
            while (this.tmp_partsList && this.tmp_partsList.length > 0) {
                this.tmp_partsList.pop();
            }
            if (this.part != null) {
                this.tmp_partsList.push({produkt: this.part.nummer, teil: {child: this.part, parent: null}});

                for (let best of this.part.bestandteile) {
                    for (let pt of this.eParts) {
                        if (best._id == pt._id) {
                            this.getBestandteile(pt, this.part);
                        }
                    }
                }
                this.initArrays();
                for (let tmp of this.tmp_partsList) {
                    this.partsList.push(tmp);
                }
            }
        }

    }

    getBestandteile(child, parent) {
        this.tmp_partsList.push({produkt: this.part.nummer, teil: {child: child, parent: parent}});
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

    updateArrays(isInitial) {
        var parts = [];
        var ende = 4;
        if (isInitial) {
            parts = this.tmp_partsList;
        }
        else {
            parts = this.partsListSingle;
        }
        while (ende >= 0) {
            for (let pt of parts) {
                this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pt.teil.child.nummer] = this.sumProdAuftraege(pt.teil.child) < 0 ? 0 : this.sumProdAuftraege(pt.teil.child);
                if (pt.teil.parent) {
                    this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + pt.teil.child.nummer] = this.prodAuftraege[this.part.typ + this.part.nummer + "_" + pt.teil.parent.nummer];
                    this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + pt.teil.child.nummer] = this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + pt.teil.parent.nummer];
                }
            }
            ende--;
        }
        this.sessionService.setPartOrders(this.prodAuftraege);
        this.sessionService.setPlannedWarehouseStock(this.geplLagerbestand);
    }

    sumProdAuftraege(part) {
        return Math.ceil(this.auftraegeVerbindl[this.part.typ + this.part.nummer + "_" + part.nummer] +
            this.auftraegeWarteschlAddiert[this.part.typ + this.part.nummer + "_" + part.nummer] +
            this.geplLagerbestand[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.lagerbestandVorperiode[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.auftraegeWarteschl[this.part.typ + this.part.nummer + "_" + part.nummer] -
            this.auftraegeBearb[this.part.typ + this.part.nummer + "_" + part.nummer]);
    }

    isGleichTeil(nummer) {
        var num = Number.parseInt(nummer);
        return num === 16 || num === 17 || num === 26;
    }

    filterList() {
        for (let pt of this.pParts) {
            if (pt.nummer === Number.parseInt(this.auswahl)) {
                this.part = pt;
            }
        }
        this.partsListSingle = this.partsList.filter(item => item.produkt == this.part.nummer);
    }
}