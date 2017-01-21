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
/**
 * Created by philipp.koepfer on 02.11.16.
 */
var core_1 = require('@angular/core');
var xmlImport_service_1 = require('../../services/xmlImport.service');
var session_service_1 = require('../../services/session.service');
var db_service_1 = require('../../services/db.service');
var app_service_1 = require('../../services/app.service');
var XmlImportComponent = (function () {
    function XmlImportComponent(xmlImportService, sessionService, dbService, appService) {
        var _this = this;
        this.xmlImportService = xmlImportService;
        this.appService = appService;
        this.xml = "";
        this.periods = [];
        this.errorMessage = "";
        this.fileName = "";
        this.xmlService = xmlImportService;
        this.sessionService = sessionService;
        this.dbService = dbService;
        this.selectedPeriod = sessionService.getResultObject().results;
        if (this.selectedPeriod)
            if (this.selectedPeriod.period !== "")
                this.success = true;
        dbService.getResults()
            .subscribe(function (results) {
            _this.allResults = results;
            for (var i = 0; i <= _this.allResults.length - 1; i++) {
                if (_this.allResults[i].results) {
                    _this.periods.push(_this.allResults[i].results.period);
                }
            }
            _this.periods.sort();
        }, function (err) { return console.log(err); }, function () { return console.log("Periods loaded!"); });
        //this.xml = JSON.stringify(this.resultObj);
    }
    XmlImportComponent.prototype.changeListener = function ($event) {
        this.readThis($event.target);
    };
    XmlImportComponent.prototype.readThis = function (inputValue) {
        var self = this;
        var file = inputValue.files[0];
        this.fileName = file.name ? file.name : "";
        var myReader = new FileReader();
        myReader.onloadend = function (e) {
            var xmlString = myReader.result[2] + myReader.result[3] + myReader.result[4];
            if (xmlString !== "xml") {
                self.errorMessage = null;
                self.success = false;
                return;
            }
            self.xml = myReader.result;
            self.xmlService.convertToJson(self.xml)
                .subscribe(function (jsonObj) {
                var result = JSON.parse(jsonObj);
                for (var i = 0; i <= self.periods.length; i++) {
                    if (result.results.period === self.periods[i]) {
                        self.errorMessage = self.periods[i];
                        self.success = false;
                        return;
                    }
                }
                self.selectedPeriod = result.results;
                self.sessionService.setResultObject(result);
                self.dbService.addResult(result)
                    .subscribe(function (result) {
                    self.periods.push(result.results.period);
                    self.periods.sort();
                }, function (err) {
                    console.log(err);
                    self.errorMessage = err;
                    self.success = false;
                }, function () { return console.log("Period Added"); });
                self.success = true;
            });
        };
        myReader.readAsText(file);
    };
    XmlImportComponent.prototype.periodSelected = function (event) {
        for (var i = 0; i <= this.allResults.length - 1; i++) {
            if (this.allResults[i].results) {
                if (this.allResults[i].results.period === event) {
                    this.selectedPeriod = this.allResults[i].results;
                    this.sessionService.setResultObject(this.allResults[i]);
                }
            }
        }
        if (this.selectedPeriod) {
            this.success = true;
        }
        else {
            this.errorMessage = "Fehler, inkonsistente Daten.";
            this.success = false;
        }
    };
    XmlImportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'xmlImport',
            templateUrl: 'xmlImport.component.html'
        }), 
        __metadata('design:paramtypes', [xmlImport_service_1.XmlImportService, session_service_1.SessionService, db_service_1.DBService, app_service_1.AppService])
    ], XmlImportComponent);
    return XmlImportComponent;
}());
exports.XmlImportComponent = XmlImportComponent;
//# sourceMappingURL=xmlImport.component.js.map