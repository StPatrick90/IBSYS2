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
 * Created by Paddy on 03.01.2017.
 */
var core_1 = require('@angular/core');
var db_service_1 = require('../../../services/db.service');
var translate_pipe_1 = require('../../../translate/translate.pipe');
var WarehousestockComponent = (function () {
    function WarehousestockComponent(dbService, translatePipe) {
        var _this = this;
        this.dbService = dbService;
        this.translatePipe = translatePipe;
        this.periods = [];
        this.lineChartLabels = Array();
        this.lineChartData = [{ data: [], label: 'Warehousestock' }];
        this.lineChartOptions = {
            animation: false,
            responsive: true
        };
        this.lineChartColors = [
            {
                backgroundColor: 'rgba(25, 70, 143, 0.2)',
                borderColor: 'rgba(25, 70, 143, 1)',
                pointBackgroundColor: 'rgba(25, 70, 143, 1)',
                pointBorderColor: '#19468f',
                pointHoverBackgroundColor: '#19468f',
                pointHoverBorderColor: 'rgba(25, 70, 143, 0.8)'
            },
            {
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(255, 0, 0, 1)',
                pointBackgroundColor: 'rgba(255, 0, 03, 1)',
                pointBorderColor: '#ff0000',
                pointHoverBackgroundColor: '#ff0000',
                pointHoverBorderColor: 'rgba(255, 0, 0, 0.8)'
            }
        ];
        this.lineChartLegend = false;
        this.lineChartType = 'line';
        dbService.getResults()
            .subscribe(function (results) {
            _this.allResults = results;
            for (var i = 0; i <= _this.allResults.length - 1; i++) {
                if (_this.allResults[i].results) {
                    _this.periods.push(_this.allResults[i].results.period);
                }
            }
            _this.periods.sort();
        }, function (err) { return console.log(err); }, function () { return _this.initAll(); });
    }
    WarehousestockComponent.prototype.initAll = function () {
        var data = [];
        var dataGrenze = [];
        for (var _i = 0, _a = this.periods; _i < _a.length; _i++) {
            var p = _a[_i];
            this.lineChartLabels.push(this.translatePipe.transform('overWH_period', null) + " " + p);
        }
        var normal = true;
        for (var _b = 0, _c = this.allResults; _b < _c.length; _b++) {
            var r = _c[_b];
            if (Number.parseInt(r.results.period) - 1 < 0) {
                normal = false;
            }
            if (normal) {
                data[Number.parseInt(r.results.period) - 1] = Number.parseInt(r.results.warehousestock.totalstockvalue);
                dataGrenze[Number.parseInt(r.results.period) - 1] = 250000;
            }
            else {
                data[Number.parseInt(r.results.period)] = Number.parseInt(r.results.warehousestock.totalstockvalue);
                dataGrenze[Number.parseInt(r.results.period)] = 250000;
            }
        }
        this.lineChartData = [{ data: data, label: this.translatePipe.transform('overWH_warehousestock', null) },
            { data: dataGrenze, label: this.translatePipe.transform('overWH_limit', null), fill: false }];
    };
    WarehousestockComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'warehousestock',
            templateUrl: 'warehousestock.component.html'
        }), 
        __metadata('design:paramtypes', [db_service_1.DBService, translate_pipe_1.TranslatePipe])
    ], WarehousestockComponent);
    return WarehousestockComponent;
}());
exports.WarehousestockComponent = WarehousestockComponent;
//# sourceMappingURL=warehousestock.component.js.map