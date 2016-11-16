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
 * Created by Paddy on 11.11.2016.
 */
var core_1 = require('@angular/core');
var workstastion_1 = require('../../../model/workstastion');
var workstation_service_1 = require('../../../services/workstation.service');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var WorkstationsComponent = (function () {
    function WorkstationsComponent(workstationService) {
        var _this = this;
        this.workstationService = workstationService;
        this.workstation = new workstastion_1.Workstation();
        this.workstationService.getWorkstations()
            .subscribe(function (workstations) {
            _this.workstations = workstations;
        });
    }
    WorkstationsComponent.prototype.deleteWorkstation = function (workstation) {
        var workstations = this.workstations;
        this.workstationService.deleteWorkstation(workstation._id)
            .subscribe((function (data) {
            if (data.n == 1) {
                for (var i = 0; i < workstations.length; i++) {
                    if (workstations[i]._id == workstation._id) {
                        workstations.splice(i, 1);
                    }
                }
            }
        }));
    };
    WorkstationsComponent.prototype.updateWorkstation = function (event) {
        var _this = this;
        event.preventDefault();
        var workstations = this.workstations;
        var bereitsVorhanden = false;
        for (var _i = 0, workstations_1 = workstations; _i < workstations_1.length; _i++) {
            var ws = workstations_1[_i];
            if (ws.nummer == this.workstation.nummer && ws._id != this.workstation._id) {
                bereitsVorhanden = true;
            }
        }
        if (!bereitsVorhanden) {
            if (!this.workstation._id) {
                var newWorkstation = {
                    nummer: this.workstation.nummer,
                    name: this.workstation.name
                };
                if (newWorkstation.nummer != null && newWorkstation.name != null) {
                    this.workstationService.addWorkstation(newWorkstation)
                        .subscribe(function (workstation) {
                        _this.workstations.push(workstation);
                        _this.resetWorkstation();
                    });
                }
                else {
                    this.modalWsEmpty.open();
                }
            }
            else {
                this.workstationService.updateWorkstation(this.workstation)
                    .subscribe(function (data) {
                    if (data.n == 1) {
                        for (var i = 0; i < workstations.length; i++) {
                            if (workstations[i]._id == _this.workstation._id) {
                                workstations[i] = _this.workstation;
                            }
                        }
                    }
                    _this.resetWorkstation();
                });
            }
        }
        else {
            this.modalWsExists.open();
        }
    };
    WorkstationsComponent.prototype.resetWorkstation = function () {
        this.workstation = { _id: null, nummer: null, name: null };
    };
    WorkstationsComponent.prototype.setWorkstation = function (ws) {
        this.workstation = ws;
    };
    __decorate([
        core_1.ViewChild('modalWsExists'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], WorkstationsComponent.prototype, "modalWsExists", void 0);
    __decorate([
        core_1.ViewChild('modalWsEmpty'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], WorkstationsComponent.prototype, "modalWsEmpty", void 0);
    WorkstationsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'workstations',
            templateUrl: 'workstations.component.html'
        }), 
        __metadata('design:paramtypes', [workstation_service_1.WorkstationService])
    ], WorkstationsComponent);
    return WorkstationsComponent;
}());
exports.WorkstationsComponent = WorkstationsComponent;
//# sourceMappingURL=workstations.component.js.map