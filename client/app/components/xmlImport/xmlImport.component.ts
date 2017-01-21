/**
 * Created by philipp.koepfer on 02.11.16.
 */
import { Component, Input } from '@angular/core';
import { XmlImportService } from '../../services/xmlImport.service';
import { WindowRef } from '../../services/window.service';
import { SessionService } from '../../services/session.service';
import { DBService} from '../../services/db.service';
import { AppService} from '../../services/app.service';


@Component({
    moduleId: module.id,
    selector: 'xmlImport',
    templateUrl: 'xmlImport.component.html'
})
export class XmlImportComponent {

    xml = "";
    xmlService: any;
    sessionService: any;
    dbService: any;
    resultObj;
    allResults: any;
    periods = [];
    selectedPeriod: any;
    success;
    errorMessage ="";
    fileName = "";

    constructor(private xmlImportService: XmlImportService, sessionService: SessionService, dbService: DBService, private appService:AppService){
        this.xmlService = xmlImportService;
        this.sessionService = sessionService;
        this.dbService = dbService;
        this.selectedPeriod = sessionService.getResultObject().results;
        if(this.selectedPeriod)
            if(this.selectedPeriod.period !== "")
                this.success = true;

        dbService.getResults()
            .subscribe(
                results =>{
                    this.allResults = results;
                    for(var i = 0; i <= this.allResults.length-1; i++){
                        if(this.allResults[i].results){
                            this.periods.push(this.allResults[i].results.period);
                        }
                    }
                    this.periods.sort();},
                err => console.log(err),
                () => console.log("Periods loaded!"));
        //this.xml = JSON.stringify(this.resultObj);
    }

    changeListener($event) : void {
        this.readThis($event.target);
    }

    readThis(inputValue: any) {
        var self = this;
        var file: File = inputValue.files[0];
        this.fileName = file.name ? file.name : "";
        var myReader: FileReader = new FileReader();

        myReader.onloadend = function(e){

            var xmlString = myReader.result[2]+myReader.result[3]+myReader.result[4];
            if(xmlString !== "xml"){
                self.errorMessage = null;
                self.success = false;
                return;
            }

            self.xml = myReader.result;
            self.xmlService.convertToJson(self.xml)
                .subscribe(jsonObj => {
                    var result = JSON.parse(jsonObj);

                    for(var i = 0; i <= self.periods.length; i++){
                        if(result.results.period === self.periods[i]){
                            self.errorMessage = self.periods[i];
                            self.success = false;
                            return;
                        }
                    }
                    self.selectedPeriod = result.results;
                    self.sessionService.setResultObject(result);
                    self.dbService.addResult(result)
                        .subscribe(
                            result => {
                                self.periods.push(result.results.period);
                                self.periods.sort();
                            },
                            err => {
                                console.log(err);
                                self.errorMessage = err;
                                self.success = false;
                            },
                            () => console.log("Period Added"));
                    self.success = true;
                })
        }
        myReader.readAsText(file);
    }

    periodSelected(event) : void{
        for(var i = 0; i <= this.allResults.length-1; i++){
            if(this.allResults[i].results){
                if(this.allResults[i].results.period === event){
                    this.selectedPeriod = this.allResults[i].results;
                    this.sessionService.setResultObject(this.allResults[i]);
                }
            }
        }
        if(this.selectedPeriod){
            this.success = true;
        }
        else{
            this.errorMessage = "Fehler, inkonsistente Daten.";
            this.success = false;
        }
    }
}