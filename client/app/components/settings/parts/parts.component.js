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
 * Created by Paddy on 13.11.2016.
 */
var core_1 = require('@angular/core');
var part_service_1 = require('../../../services/part.service');
var PartsComponent = (function () {
    function PartsComponent(partservice) {
        var _this = this;
        this.partservice = partservice;
        this.typOptions = [
            { id: 1, name: 'K' },
            { id: 2, name: 'D' },
            { id: 3, name: 'H' }
        ];
        this.typSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 0,
            closeOnSelect: false,
            showCheckAll: true,
            showUncheckAll: true,
            dynamicTitleMaxItems: 3,
            maxHeight: '300px',
        };
        this.typTexts = {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            defaultTitle: 'Select',
        };
        this.partservice.getParts()
            .subscribe(function (parts) {
            _this.parts = parts;
        });
    }
    PartsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'parts',
            templateUrl: 'parts.component.html'
        }), 
        __metadata('design:paramtypes', [part_service_1.PartService])
    ], PartsComponent);
    return PartsComponent;
}());
exports.PartsComponent = PartsComponent;
//# sourceMappingURL=parts.component.js.map