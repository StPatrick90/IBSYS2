/**
 * Created by philipp.koepfer on 02.11.16.
 */
import { Component } from '@angular/core';
import { XmlImportService } from '../../services/xmlImport.service';
import { WindowRef } from '../../services/window.service';
import { SessionService } from '../../services/session.service';
import {resumeBootstrap} from "@angular/upgrade/src/angular_js";


@Component({
    moduleId: module.id,
    selector: 'xmlImport',
    templateUrl: 'xmlImport.component.html'
})
export class XmlImportComponent {


    xml = "";
    xmlService: any;
    sessionService: any;
    resultObj;

    constructor(private xmlImportService: XmlImportService, sessionService: SessionService){
        this.xmlService = xmlImportService;
        this.sessionService = sessionService;
        this.resultObj = sessionService.getResultObject();
        this.xml = JSON.stringify(this.resultObj);
    }

    changeListener($event) : void {
        this.readThis($event.target);
    }

    readThis(inputValue: any) {
        var self = this;
        var file: File = inputValue.files[0];
        var myReader: FileReader = new FileReader();

        myReader.onloadend = function(e){
            self.xml = myReader.result;
            self.xmlService.convertToJson(self.xml)
                .subscribe(jsonObj => {
                    self.resultObj = JSON.parse(jsonObj);
                    self.xml = JSON.stringify(self.resultObj);
                    self.sessionService.setResultObject(self.resultObj);
                    console.log(self.resultObj);
                })
        }
        myReader.readAsText(file);
    }
}