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
var forecast_service_1 = require('../../services/forecast.service');
var session_service_1 = require('../../services/session.service');
var forecast_1 = require('../../model/forecast');
var ForecastComponent = (function () {
    function ForecastComponent(forecastService, sessionService) {
        var _this = this;
        this.forecastService = forecastService;
        this.sessionService = sessionService;
        this.periods = new Array();
        this.period = 0;
        this.verbdindlAuftr = new Array();
        this.geplProd = new Array();
        this.vorausBestand = new Array();
        this.menge = new Array();
        this.preis = new Array();
        this.strafe = new Array();
        if (this.sessionService.getResultObject()) {
            this.result = this.sessionService.getResultObject();
            this.period = Number.parseInt(this.result.results.period);
            this.lager = this.result.results.warehousestock.article;
            for (var i = this.period; i <= this.period + 3; i++) {
                this.periods.push(i);
            }
        }
        this.forecastService.getForecastAndParts()
            .subscribe(function (data) {
            _this.forecasts = data[0];
            _this.pParts = data[1].filter(function (item) { return item.typ == "P"; });
        }, function (err) { return console.error(err); }, function () { return _this.initAll(); });
    }
    ForecastComponent.prototype.initAll = function () {
        if (this.forecasts) {
            for (var _i = 0, _a = this.forecasts; _i < _a.length; _i++) {
                var fc = _a[_i];
                if (fc.period === this.period) {
                    for (var _b = 0, _c = fc.article; _b < _c.length; _b++) {
                        var article = _c[_b];
                        for (var _d = 0, _e = article.verbdindlicheAuftraege; _d < _e.length; _d++) {
                            var vA = _e[_d];
                            this.verbdindlAuftr["P_" + article.partNr + "_" + vA.periode] = vA.anzahl;
                        }
                        for (var _f = 0, _g = article.geplanteProduktion; _f < _g.length; _f++) {
                            var gP = _g[_f];
                            this.geplProd["P_" + article.partNr + "_" + gP.periode] = gP.anzahl;
                        }
                        for (var _h = 0, _j = article.voraussichtlicherBestand; _h < _j.length; _h++) {
                            var vB = _j[_h];
                            this.vorausBestand["P_" + article.partNr + "_" + vB.periode] = vB.anzahl;
                        }
                        this.menge["P_" + article.partNr] = article.direktVerkauf.menge;
                        this.preis["P_" + article.partNr] = article.direktVerkauf.preis;
                        this.strafe["P_" + article.partNr] = article.direktVerkauf.strafe;
                    }
                }
            }
        }
        this.saveForecast();
    };
    ForecastComponent.prototype.updateArrays = function (part, period) {
        if (period !== this.period + 3) {
            for (var i = period; i <= this.period + 3; i++) {
                this.vorausBestand["P_" + part + "_" + i] = this.getLagermenge(part, i) + this.getGeplProd(part, i) - this.getVerbindlAuftr(part, i);
            }
        }
        else {
            this.vorausBestand["P_" + part + "_" + period] = this.getLagermenge(part, period) + this.getGeplProd(part, period) - this.getVerbindlAuftr(part, period);
        }
        this.saveForecast();
    };
    ForecastComponent.prototype.getLagermenge = function (part, period) {
        var lagermenge = 0;
        if (period !== this.period) {
            lagermenge = this.vorausBestand["P_" + part + "_" + (period - 1)];
        }
        else {
            for (var _i = 0, _a = this.lager; _i < _a.length; _i++) {
                var article = _a[_i];
                if (Number.parseInt(article.id) === part) {
                    lagermenge = Number.parseInt(article.amount);
                }
            }
        }
        return lagermenge;
    };
    ForecastComponent.prototype.getGeplProd = function (part, period) {
        return this.geplProd["P_" + part + "_" + period] ? this.geplProd["P_" + part + "_" + period] : 0;
    };
    ForecastComponent.prototype.getVerbindlAuftr = function (part, period) {
        return this.verbdindlAuftr["P_" + part + "_" + period] ? this.verbdindlAuftr["P_" + part + "_" + period] : 0;
    };
    ForecastComponent.prototype.saveForecast = function () {
        var forecast = new forecast_1.Forecast();
        forecast.article = new Array();
        var direktVerkauf;
        for (var _i = 0, _a = this.pParts; _i < _a.length; _i++) {
            var pPart = _a[_i];
            var verbdindlAuftr = new Array();
            var geplProd = new Array();
            var vorausBestand = new Array();
            for (var i = this.period; i <= this.period + 3; i++) {
                if (this.verbdindlAuftr["P_" + pPart.nummer + "_" + i]) {
                    verbdindlAuftr.push({
                        periode: i,
                        anzahl: this.verbdindlAuftr["P_" + pPart.nummer + "_" + i] ? this.verbdindlAuftr["P_" + pPart.nummer + "_" + i] : 0
                    });
                }
            }
            for (var i = this.period; i <= this.period + 3; i++) {
                if (this.geplProd["P_" + pPart.nummer + "_" + i]) {
                    geplProd.push({
                        periode: i,
                        anzahl: this.geplProd["P_" + pPart.nummer + "_" + i] ? this.geplProd["P_" + pPart.nummer + "_" + i] : 0
                    });
                }
            }
            for (var i = this.period; i <= this.period + 3; i++) {
                if (this.vorausBestand["P_" + pPart.nummer + "_" + i]) {
                    vorausBestand.push({
                        periode: i,
                        anzahl: this.vorausBestand["P_" + pPart.nummer + "_" + i] ? this.vorausBestand["P_" + pPart.nummer + "_" + i] : 0
                    });
                }
            }
            direktVerkauf = {
                menge: this.menge["P_" + pPart.nummer] ? this.menge["P_" + pPart.nummer] : 0,
                preis: this.preis["P_" + pPart.nummer] ? this.preis["P_" + pPart.nummer] : 0,
                strafe: this.strafe["P_" + pPart.nummer] ? this.strafe["P_" + pPart.nummer] : 0
            };
            forecast.period = this.period;
            forecast.article.push({
                partNr: pPart.nummer,
                verbdindlicheAuftraege: verbdindlAuftr,
                geplanteProduktion: geplProd,
                voraussichtlicherBestand: vorausBestand,
                direktVerkauf: direktVerkauf,
                produktkennung: pPart.bezeichnung.charAt(0)
            });
        }
        this.sessionService.setForecast(forecast);
        console.log(forecast);
    };
    ForecastComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'forecast',
            templateUrl: 'forecast.component.html'
        }), 
        __metadata('design:paramtypes', [forecast_service_1.ForecastService, session_service_1.SessionService])
    ], ForecastComponent);
    return ForecastComponent;
}());
exports.ForecastComponent = ForecastComponent;
//# sourceMappingURL=forecast.component.js.map