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
var XmlImportComponent = (function () {
    function XmlImportComponent(xmlImportService) {
        this.xmlImportService = xmlImportService;
        this.xml = "";
        this.resultObj = {};
        this.xmlService = xmlImportService;
    }
    XmlImportComponent.prototype.changeListener = function ($event) {
        this.readThis($event.target);
    };
    XmlImportComponent.prototype.readThis = function (inputValue) {
        var self = this;
        var file = inputValue.files[0];
        var myReader = new FileReader();
        myReader.onloadend = function (e) {
            self.xml = myReader.result;
            //console.log(this.xmltest);
            self.xmlService.convertToJson(self.xml)
                .subscribe(function (jsonObj) {
                self.resultObj = JSON.parse(jsonObj);
            });
        };
        myReader.readAsText(file);
    };
    XmlImportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'xmlImport',
            templateUrl: 'xmlImport.component.html'
        }), 
        __metadata('design:paramtypes', [xmlImport_service_1.XmlImportService])
    ], XmlImportComponent);
    return XmlImportComponent;
}());
exports.XmlImportComponent = XmlImportComponent;
//# sourceMappingURL=xmlImport.component.js.map