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
var session_service_1 = require('../../services/session.service');
var XmlExportComponent = (function () {
    function XmlExportComponent(sessionService) {
        this.sessionService = sessionService;
        this.prioOutput = [];
        this.jsonString = "";
    }
    XmlExportComponent.prototype.ngOnInit = function () {
        this.prioOutput = this.sessionService.getPrioOutput();
        this.jsonString = JSON.stringify(this.prioOutput);
    };
    XmlExportComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'xmlExport',
            templateUrl: 'xmlExport.component.html'
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService])
    ], XmlExportComponent);
    return XmlExportComponent;
}());
exports.XmlExportComponent = XmlExportComponent;
//# sourceMappingURL=xmlExport.component.js.map