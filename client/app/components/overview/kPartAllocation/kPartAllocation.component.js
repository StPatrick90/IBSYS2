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
 * Created by Paddy on 04.01.2017.
 */
var core_1 = require("@angular/core");
var part_service_1 = require("../../../services/part.service");
var session_service_1 = require("../../../services/session.service");
var KPartAllocationComponent = (function () {
    function KPartAllocationComponent(partService, sessionService) {
        var _this = this;
        this.partService = partService;
        this.sessionService = sessionService;
        this.partAllocation = new Array();
        if (this.sessionService.getParts()) {
            this.parts = this.sessionService.getParts();
            this.kparts = this.sessionService.getParts().filter(function (item) { return item.typ == "K"; });
            this.initAll();
        }
        else {
            this.partService.getParts()
                .subscribe(function (parts) {
                _this.parts = parts;
                _this.kparts = parts.filter(function (item) { return item.typ == "K"; });
            }, function (err) { return console.error(err); }, function () { return _this.initAll(); });
        }
    }
    KPartAllocationComponent.prototype.initAll = function () {
        for (var _i = 0, _a = this.kparts; _i < _a.length; _i++) {
            var kpart = _a[_i];
            for (var _b = 0, _c = this.parts; _b < _c.length; _b++) {
                var part = _c[_b];
                for (var _d = 0, _e = part.bestandteile; _d < _e.length; _d++) {
                    var bestandteil = _e[_d];
                    if (bestandteil._id === kpart._id) {
                        if (!this.partAllocation[kpart.nummer]) {
                            this.partAllocation[kpart.nummer] = [];
                        }
                        this.partAllocation[kpart.nummer].push(part);
                    }
                }
            }
        }
    };
    return KPartAllocationComponent;
}());
KPartAllocationComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'kPartAllocation',
        templateUrl: 'kPartAllocation.component.html'
    }),
    __metadata("design:paramtypes", [part_service_1.PartService, session_service_1.SessionService])
], KPartAllocationComponent);
exports.KPartAllocationComponent = KPartAllocationComponent;
//# sourceMappingURL=kPartAllocation.component.js.map