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
 * Created by Paddy on 18.12.2016.
 */
var core_1 = require("@angular/core");
var part_service_1 = require("../../services/part.service");
var session_service_1 = require("../../services/session.service");
var MaterialPlanningEPComponent = (function () {
    function MaterialPlanningEPComponent(partService, sessionService) {
        this.partService = partService;
        this.sessionService = sessionService;
        this.columns = 14;
        this.partsList = Array();
        this.productOptions = Array();
        this.getNumber = function (num) {
            var array = Array();
            for (var i = 1; i <= num; i++) {
                array.push(i);
            }
            return array;
        };
    }
    MaterialPlanningEPComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.sessionService.getParts() != null || this.sessionService.getParts() != undefined) {
            this.eParts = this.sessionService.getParts().filter(function (item) { return item.typ == "E"; });
            this.pParts = this.sessionService.getParts().filter(function (item) { return item.typ == "P"; });
            this.initMultiSelects();
        }
        else {
            this.partService.getParts()
                .subscribe(function (data) {
                _this.eParts = data.filter(function (item) { return item.typ == "E"; });
                _this.pParts = data.filter(function (item) { return item.typ == "P"; });
            }, function (err) { return console.error(err); }, function () { return _this.initMultiSelects(); });
        }
    };
    MaterialPlanningEPComponent.prototype.initMultiSelects = function () {
        for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
            var pt = _a[_i];
            this.productOptions.push({ id: pt.nummer, name: pt.bezeichnung.toString() });
        }
        this.productSettings = {
            pullRight: false,
            enableSearch: false,
            checkedStyle: 'glyphicon',
            buttonClasses: 'btn btn-default',
            selectionLimit: 1,
            closeOnSelect: true,
            showCheckAll: false,
            showUncheckAll: false,
            dynamicTitleMaxItems: 1,
            maxHeight: '100px',
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
    MaterialPlanningEPComponent.prototype.generatePartsList = function () {
        if (this.auswahl != undefined && this.auswahl.length == 1) {
            for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
                var pt = _a[_i];
                if (pt.nummer == this.auswahl[0]) {
                    this.part = pt;
                }
            }
            if (this.part != null) {
                this.partsList.push(this.part);
                for (var _b = 0, _c = this.part.bestandteile; _b < _c.length; _b++) {
                    var best = _c[_b];
                    for (var _d = 0, _e = this.eParts; _d < _e.length; _d++) {
                        var pt = _e[_d];
                        if (best._id == pt._id) {
                            this.getBestandteile(pt);
                        }
                    }
                }
            }
        }
    };
    MaterialPlanningEPComponent.prototype.getBestandteile = function (part) {
        this.partsList.push(part);
        if (part.bestandteile && part.bestandteile.length > 0) {
            for (var _i = 0, _a = part.bestandteile; _i < _a.length; _i++) {
                var best = _a[_i];
                for (var _b = 0, _c = this.eParts; _b < _c.length; _b++) {
                    var pt = _c[_b];
                    if (best._id == pt._id) {
                        this.getBestandteile(pt);
                    }
                }
            }
        }
    };
    return MaterialPlanningEPComponent;
}());
MaterialPlanningEPComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'materialPlanningEP',
        templateUrl: 'materialPlanningEP.component.html'
    }),
    __metadata("design:paramtypes", [part_service_1.PartService, session_service_1.SessionService])
], MaterialPlanningEPComponent);
exports.MaterialPlanningEPComponent = MaterialPlanningEPComponent;
//# sourceMappingURL=materialPlanningEP.component.js.map