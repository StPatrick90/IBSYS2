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
 * Created by Paddy on 17.12.2016.
 */
var core_1 = require('@angular/core');
// Tell Angular2 we're creating a Pipe with TypeScript decorators
var PartPipe = (function () {
    function PartPipe() {
    }
    PartPipe.prototype.transform = function (value, args) {
        if (args === undefined || args === null || args === "") {
            return value;
        }
        return value.filter(function (part) {
            return part.bezeichnung.toUpperCase().includes(args.toUpperCase()) || part.nummer === Number.parseInt(args.toUpperCase());
        });
    };
    PartPipe = __decorate([
        core_1.Pipe({
            name: 'partPipe'
        }), 
        __metadata('design:paramtypes', [])
    ], PartPipe);
    return PartPipe;
}());
exports.PartPipe = PartPipe;
//# sourceMappingURL=parts.pipe.js.map