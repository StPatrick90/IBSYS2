/**
 * Created by philipp.koepfer on 15.01.17.
 */

import { Component} from '@angular/core';
import { XmlImportService } from '../../services/xmlImport.service';
import { SessionService } from '../../services/session.service';
import {Sequence} from "../../model/sequence";


@Component({
    moduleId: module.id,
    selector: 'xmlExport',
    templateUrl: 'xmlExport.component.html'
})
export class XmlExportComponent {

    mergedObjects: any;
    xmlString: string = "";

    displayString: string = "";

    constructor(private sessionService: SessionService, private xmlImportService: XmlImportService){}

    ngOnInit() {

        this.mergedObjects = {
            "input": {
                qualitycontrol: '', //attr: {type: 'no', losequantity: '0', delay: '0'},
                "sellwish": [],
                "selldirect": [],
                "orderlist": [],
                "productionlist": [],
                "workingtimelist": []
            }
        }

        this.xmlString = "";

        this.convertReihenfolgen(this.sessionService.getReihenfolgen());
        this.convertPrioOutput(this.sessionService.getPrioOutput());

        this.xmlImportService.convertToXml(this.mergedObjects)
            .subscribe(xmlObj => {
                this.xmlString = xmlObj.name;
                this.displayString = this.convertDisplayString(this.xmlString);
            });
    }
    convertPrioOutput(prioOutput){
        for(var auftrag of prioOutput){
            this.mergedObjects.input.productionlist.push({production: '', attr: {article: auftrag.Teil.nummer, quantity: auftrag.Anzahl}});
        }
    }
    convertReihenfolgen(reihenfolgen){
        for(var sequence of reihenfolgen){
            this.mergedObjects.input.workingtimelist.push({workingtime: '', attr:{station: sequence.workstation.nummer, shift: 'Todo', overtime: 'Todo'}});
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


}
