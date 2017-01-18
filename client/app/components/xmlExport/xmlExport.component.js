/**
 * Created by philipp.koepfer on 15.01.17.
 */
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var xmlImport_service_1 = require('../../services/xmlImport.service');
var session_service_1 = require('../../services/session.service');
var saveAs = require('file-saver');
var XmlExportComponent = (function () {
    function XmlExportComponent(sessionService, xmlImportService) {
        this.sessionService = sessionService;
        this.xmlImportService = xmlImportService;
        this.name = "resultXML";
        this.xmlString = "";
        this.displayString = "";
    }
    XmlExportComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.mergedObjects = {
            "input": {
                "sellwish": [],
                "selldirect": [],
                "orderlist": [],
                "productionlist": [],
                "workingtimelist": []
            }
        };
        this.xmlString = "";
        this.convertReihenfolgen(this.sessionService.getCapacities());
        this.convertPrioOutput(this.sessionService.getPrioOutput());
        this.convertForcast(this.sessionService.getForecast());
        this.xmlImportService.convertToXml(this.mergedObjects)
            .subscribe(function (xmlObj) {
            _this.xmlString = xmlObj.name;
            _this.displayString = _this.convertDisplayString(_this.xmlString);
            _this.displayString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<qualitycontrol type=\"no\" losequantity=\"0\" delay=\"0\"/> \n" + _this.displayString;
        });
    };
    XmlExportComponent.prototype.convertPrioOutput = function (prioOutput) {
        if (prioOutput != null)
            for (var _i = 0, prioOutput_1 = prioOutput; _i < prioOutput_1.length; _i++) {
                var auftrag = prioOutput_1[_i];
                this.mergedObjects.input.productionlist.push({ production: '', attr: { article: auftrag.Teil.nummer, quantity: auftrag.Anzahl } });
            }
    };
    XmlExportComponent.prototype.convertReihenfolgen = function (capa) {
        if (capa === null)
            return;
        capa = capa.sort(function (item) { return item.workstationNumber; });
        for (var _i = 0, capa_1 = capa; _i < capa_1.length; _i++) {
            var c = capa_1[_i];
            this.mergedObjects.input.workingtimelist.push({ workingtime: '', attr: { station: c.workstationNumber, shift: c.schichten, overtime: c.ueberstunden } });
        }
    };
    XmlExportComponent.prototype.convertForcast = function (forecast) {
        if (forecast != null)
            for (var _i = 0, _a = forecast.article; _i < _a.length; _i++) {
                var article = _a[_i];
                if (article.partNr === 1) {
                    this.mergedObjects.input.sellwish.push({ item: '', attr: { article: article.partNr, quantity: article.verbdindlicheAuftraege[0].anzahl } });
                    this.mergedObjects.input.selldirect.push({ item: '', attr: { article: article.partNr, quantity: article.direktVerkauf.menge, price: article.direktVerkauf.preis, penalty: article.direktVerkauf.strafe } });
                }
                if (article.partNr === 2) {
                    this.mergedObjects.input.sellwish.push({ item: '', attr: { article: article.partNr, quantity: article.verbdindlicheAuftraege[0].anzahl } });
                    this.mergedObjects.input.selldirect.push({ item: '', attr: { article: article.partNr, quantity: article.direktVerkauf.menge, price: article.direktVerkauf.preis, penalty: article.direktVerkauf.strafe } });
                }
                if (article.partNr === 3) {
                    this.mergedObjects.input.sellwish.push({ item: '', attr: { article: article.partNr, quantity: article.verbdindlicheAuftraege[0].anzahl } });
                    this.mergedObjects.input.selldirect.push({ item: '', attr: { article: article.partNr, quantity: article.direktVerkauf.menge, price: article.direktVerkauf.preis, penalty: article.direktVerkauf.strafe } });
                }
            }
    };
    XmlExportComponent.prototype.convertDisplayString = function (xml) {
        for (var charIdx = 0; charIdx < xml.length; charIdx++) {
            if (xml.charAt(charIdx) === '>') {
                xml = [xml.slice(0, charIdx + 1), '\n', xml.slice(charIdx + 1)].join('');
            }
        }
        return xml;
    };
    XmlExportComponent.prototype.downloadFIle = function () {
        var file = new Blob([this.displayString], { type: 'text/xml;charset=utf-8' });
        saveAs(file, this.name + '.xml');
    };
    XmlExportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'xmlExport',
            templateUrl: 'xmlExport.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, xmlImport_service_1.XmlImportService])
    ], XmlExportComponent);
    return XmlExportComponent;
}());
exports.XmlExportComponent = XmlExportComponent;
//# sourceMappingURL=xmlExport.component.js.map