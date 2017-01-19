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
var core_1 = require("@angular/core");
var translate_pipe_1 = require("../translate/translate.pipe");
// Tell Angular2 we're creating a Pipe with TypeScript decorators
var PartPipe = (function () {
    function PartPipe(translatePipe) {
        this.translatePipe = translatePipe;
    }
    PartPipe.prototype.transform = function (value, args) {
        var _this = this;
        if (args === undefined || args === null || args === "") {
            return value;
        }
        return value.filter(function (part) {
            return part.bezeichnung.toUpperCase().includes(args.toUpperCase()) || part.nummer === Number.parseInt(args.toUpperCase()) || _this.translatePipe.transform(part.bezeichnung.toString(), null).toUpperCase().includes(args.toUpperCase());
        });
    };
    return PartPipe;
}());
PartPipe = __decorate([
    core_1.Pipe({
        name: 'partPipe'
    }),
    __metadata("design:paramtypes", [translate_pipe_1.TranslatePipe])
], PartPipe);
exports.PartPipe = PartPipe;
//# sourceMappingURL=parts.pipe.js.map