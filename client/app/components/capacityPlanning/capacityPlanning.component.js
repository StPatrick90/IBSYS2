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
 * Created by Paddy on 03.11.2016.
 */
var core_1 = require("@angular/core");
var capacityPlanning_service_1 = require("../../services/capacityPlanning.service");
var CapacityPlanningComponent = (function () {
    function CapacityPlanningComponent(capacityPlanningService) {
        this.capacityPlanningService = capacityPlanningService;
        this.artikelListe = new Array();
    }
    CapacityPlanningComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.capacityPlanningService.getWorkstations()
            .subscribe(function (workstations) {
            _this.workstations = workstations;
        });
        this.getTimesAndEPParts();
    };
    CapacityPlanningComponent.prototype.getTimesAndEPParts = function () {
        var _this = this;
        this.capacityPlanningService.getTimesAndEPParts().subscribe(function (data) {
            _this.processingTimes = data[0];
            _this.parts = data[1];
        }, function (err) { return console.error(err); }, function () { return _this.generateRows(); });
    };
    ;
    CapacityPlanningComponent.prototype.generateRows = function () {
        for (var _i = 0, _a = this.parts; _i < _a.length; _i++) {
            var part = _a[_i];
            var zuweisung = new Array();
            for (var _b = 0, _c = this.processingTimes; _b < _c.length; _b++) {
                var pt = _c[_b];
                var apZeit = [];
                if (pt.teil.nummer === part.nummer) {
                    apZeit.push(pt.arbeitsplatz.nummer);
                    apZeit.push(pt.fertigungsZeit);
                    apZeit.push(pt.ruestZeit);
                    zuweisung.push(apZeit);
                }
            }
            var prodTime = {
                part: part.nummer,
                zuweisung: zuweisung
            };
            this.artikelListe.push(prodTime);
        }
    };
    return CapacityPlanningComponent;
}());
CapacityPlanningComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'capacityPlanning',
        templateUrl: 'capacityPlanning.component.html'
    }),
    __metadata("design:paramtypes", [capacityPlanning_service_1.CapacityPlanningService])
], CapacityPlanningComponent);
exports.CapacityPlanningComponent = CapacityPlanningComponent;
//# sourceMappingURL=capacityPlanning.component.js.map