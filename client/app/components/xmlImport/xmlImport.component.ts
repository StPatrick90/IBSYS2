/**
 * Created by philipp.koepfer on 02.11.16.
 */
import { Component, Input } from '@angular/core';
import { XmlImportService } from '../../services/xmlImport.service';
import { WindowRef } from '../../services/window.service';
import { SessionService } from '../../services/session.service';
import { DBService} from '../../services/db.service';


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

    constructor(private xmlImportService: XmlImportService, sessionService: SessionService, dbService: DBService){
        this.xmlService = xmlImportService;
        this.sessionService = sessionService;
        this.dbService = dbService;
        this.selectedPeriod = sessionService.getResultObject();

        if(this.selectedPeriod)
            this.success = true;

        dbService.getResults()
            .subscribe(
                results =>{
                    this.allResults = results;
                    for(var i = 0; i <= this.allResults.length-1; i++){
                        console.log(this.allResults[i]);
                        if(this.allResults[i].results){
                            this.periods.push(this.allResults[i].results.period);
                        }
                    }
                    this.periods.sort();},
                err => console.log(err),
                () => console.log("Completed"));
        //this.xml = JSON.stringify(this.resultObj);
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
                    var result = JSON.parse(jsonObj);
                    //self.xml = JSON.stringify(self.resultObj);
                    for(var i = 0; i <= self.periods.length; i++){
                        console.log(self.periods[i]);
                        if(result.results.period === self.periods[i]){
                            self.errorMessage = "Periode " + self.periods[i] + " ist schon vorhanden."
                            self.success = false;
                            console.log(self.success);
                            return;
                        }
                    }
                    self.selectedPeriod = result;
                    self.sessionService.setResultObject(self.selectedPeriod);
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
                    this.sessionService.setResultObject(this.selectedPeriod);
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