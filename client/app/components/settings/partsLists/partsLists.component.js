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
 * Created by Paddy on 07.12.2016.
 */
var core_1 = require('@angular/core');
var session_service_1 = require('../../../services/session.service');
var part_service_1 = require('../../../services/part.service');
var PartsListsComponent = (function () {
    function PartsListsComponent(partservice, sessionService) {
        var _this = this;
        this.partservice = partservice;
        this.sessionService = sessionService;
        if (this.sessionService.getParts() != null || this.sessionService.getParts() != undefined) {
            this.parts = this.sessionService.getParts();
        }
        else {
            this.partservice.getParts()
                .subscribe(function (parts) {
                _this.parts = parts;
            });
        }
    }
    PartsListsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'partsLists',
            templateUrl: 'partsLists.component.html'
        }), 
        __metadata('design:paramtypes', [part_service_1.PartService, session_service_1.SessionService])
    ], PartsListsComponent);
    return PartsListsComponent;
}());
exports.PartsListsComponent = PartsListsComponent;
//# sourceMappingURL=partsLists.component.js.map