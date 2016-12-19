"use strict";
var PrioTask = (function () {
    function PrioTask(id, start, ende, aktuellerAp, naechsterAp, name, teil, losgroesse, periode) {
        this._id = id;
        this.start = start;
        this.ende = ende;
        this.aktuellerAp = aktuellerAp;
        this.naechsterAp = naechsterAp;
        this.name = name;
        this.teil = teil;
        this.losgroesse = losgroesse;
        this.periode = periode;
    }
    return PrioTask;
}());
exports.PrioTask = PrioTask;
//# sourceMappingURL=prioTask.js.map