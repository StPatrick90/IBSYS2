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
var part_1 = require('../../../model/part');
var part_service_1 = require('../../../services/part.service');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var session_service_1 = require('../../../services/session.service');
var PartsComponent = (function () {
    function PartsComponent(partservice, sessionService) {
        var _this = this;
        this.partservice = partservice;
        this.sessionService = sessionService;
        this.nextWsOptions = Array();
        this.listVerfuegbareTeile = [];
        this.listBestandteile = [];
        this.part = new part_1.Part();
        this.ruestZeit = Array();
        this.fertigungsZeit = Array();
        this.nextArbeitsplaetze = Array();
        if (this.sessionService.getWorkstations() != null || this.sessionService.getWorkstations() != undefined ||
            this.sessionService.getParts() != null || this.sessionService.getParts() != undefined ||
            this.sessionService.getProcessingTimes() != null || this.sessionService.getProcessingTimes() != undefined) {
            this.workstations = this.sessionService.getWorkstations();
            this.parts = this.sessionService.getParts();
            this.processingTimes = this.sessionService.getProcessingTimes();
            this.initLists();
        }
        else {
            this.partservice.getWorkstationsAndPartsAndBearbeitung()
                .subscribe(function (data) {
                _this.workstations = data[0];
                _this.parts = data[1];
                _this.processingTimes = data[2];
            }, function (err) { return console.error(err); }, function () { return _this.initLists(); });
        }
    }
    PartsComponent.prototype.initLists = function () {
        this.fillVerfuegbareTeile();
        this.initMultiSelects();
    };
    PartsComponent.prototype.initMultiSelects = function () {
        this.typOptions = [
            { id: 1, name: 'P' },
            { id: 2, name: 'E' },
            { id: 3, name: 'K' }
        ];
        this.verwOptions = [
            { id: 1, name: 'K' },
            { id: 2, name: 'D' },
            { id: 3, name: 'H' }
        ];
        for (var _i = 0, _a = this.workstations; _i < _a.length; _i++) {
            var ws = _a[_i];
            this.nextWsOptions.push({ id: ws.nummer, name: ws.nummer.toString() });
        }
        this.typSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: false,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '100px',
        };
        this.verwSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 3,
            closeOnSelect: false,
            showCheckAll: true,
            showUncheckAll: true,
            dynamicTitleMaxItems: 3,
            maxHeight: '300px',
        };
        this.nextWsSettings = {
            pullRight: false,
            enableSearch: true,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: false,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '300px',
        };
        this.multiSelectTexts = {
            checkAll: 'Check all',
            uncheckAll: 'Uncheck all',
            checked: 'checked',
            checkedPlural: 'checked',
            searchPlaceholder: 'Search...',
            defaultTitle: 'Select',
        };
    };
    PartsComponent.prototype.fillVerfuegbareTeile = function () {
        if (this.part._id == null) {
            this.listVerfuegbareTeile = this.parts.slice();
        }
        else {
            for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
                var part = _a[_i];
                if (part._id != this.part._id) {
                    this.listVerfuegbareTeile.push(part);
                }
            }
        }
    };
    __decorate([
        core_1.ViewChild('modalBestandteile'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], PartsComponent.prototype, "modalBestandteile", void 0);
    PartsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'parts',
            templateUrl: 'parts.component.html'
        }), 
        __metadata('design:paramtypes', [part_service_1.PartService, session_service_1.SessionService])
    ], PartsComponent);
    return PartsComponent;
}());
exports.PartsComponent = PartsComponent;
//# sourceMappingURL=parts.component.js.map