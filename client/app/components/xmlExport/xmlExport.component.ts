/**
 * Created by philipp.koepfer on 15.01.17.
 */

import { Component} from '@angular/core';
import { XmlImportService } from '../../services/xmlImport.service';
import { SessionService } from '../../services/session.service';

var saveAs = require('file-saver');

@Component({
    moduleId: module.id,
    selector: 'xmlExport',
    templateUrl: 'xmlExport.component.html'
})
export class XmlExportComponent {
    name: string = "resultXML";
    mergedObjects: any;
    xmlString: string = "";

    displayString: string = "";

    constructor(private sessionService: SessionService, private xmlImportService: XmlImportService){}

    ngOnInit() {

        this.mergedObjects = {
            "input": {
                "sellwish": [],
                "selldirect": [],
                "orderlist": [],
                "productionlist": [],
                "workingtimelist": []
            }
        }

        this.xmlString = "";

        this.convertReihenfolgen(this.sessionService.getCapacities());
        this.convertPrioOutput(this.sessionService.getPrioOutput());
        this.convertForcast(this.sessionService.getForecast());

        this.xmlImportService.convertToXml(this.mergedObjects)
            .subscribe(xmlObj => {
                this.xmlString = xmlObj.name;
                this.displayString = this.convertDisplayString(this.xmlString);
                this.displayString = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<qualitycontrol type=\"no\" losequantity=\"0\" delay=\"0\"/> \n" + this.displayString;
            });
    }
    convertPrioOutput(prioOutput){
        if(prioOutput != null)
        for(var auftrag of prioOutput){
            this.mergedObjects.input.productionlist.push({production: '', attr: {article: auftrag.Teil.nummer, quantity: auftrag.Anzahl}});
        }
    }
    convertReihenfolgen(capa){
        if(capa === null)
            return;
        capa = capa.sort(item => item.workstationNumber);
        for(var c of capa){
            this.mergedObjects.input.workingtimelist.push({workingtime: '', attr:{station: c.workstationNumber, shift: c.schichten, overtime: c.ueberstunden}});
        }
    }

    convertForcast(forecast){
        if(forecast != null)
        for(var article of forecast.article){
            if(article.partNr === 1){
                this.mergedObjects.input.sellwish.push({item: '', attr:{article: article.partNr, quantity: article.verbdindlicheAuftraege[0].anzahl}});
                this.mergedObjects.input.selldirect.push({item: '', attr:{article: article.partNr, quantity: article.direktVerkauf.menge, price: article.direktVerkauf.preis, penalty: article.direktVerkauf.strafe}});
            }
            if(article.partNr === 2){
                this.mergedObjects.input.sellwish.push({item: '', attr:{article: article.partNr, quantity: article.verbdindlicheAuftraege[0].anzahl}});
                this.mergedObjects.input.selldirect.push({item: '', attr:{article: article.partNr, quantity: article.direktVerkauf.menge, price: article.direktVerkauf.preis, penalty: article.direktVerkauf.strafe}});
            }
            if(article.partNr === 3){
                this.mergedObjects.input.sellwish.push({item: '', attr:{article: article.partNr, quantity: article.verbdindlicheAuftraege[0].anzahl}});
                this.mergedObjects.input.selldirect.push({item: '', attr:{article: article.partNr, quantity: article.direktVerkauf.menge, price: article.direktVerkauf.preis, penalty: article.direktVerkauf.strafe}});
            }
        }
    }

    convertDisplayString(xml: string){
        for(var charIdx = 0; charIdx < xml.length; charIdx ++){
            if(xml.charAt(charIdx) === '>'){
                xml = [xml.slice(0, charIdx+1), '\n', xml.slice(charIdx+1)].join('');
            }
        }
        return xml;
    }

    downloadFIle(){
        let file = new Blob([this.displayString], { type: 'text/xml;charset=utf-8' });
        saveAs(file, this.name + '.xml');
    }


}
