"use strict";
/**
 * Created by Paddy on 26.10.2016.
 */
var core_1 = require("@angular/core");
// import translations
var lang_en_1 = require("./lang-en");
var lang_de_1 = require("./lang-de");
// translation token
exports.TRANSLATIONS = new core_1.OpaqueToken('translations');
// all traslations
var dictionary = (_a = {},
    _a[lang_en_1.LANG_EN_NAME] = lang_en_1.LANG_EN_TRANS,
    _a[lang_de_1.LANG_DE_NAME] = lang_de_1.LANG_DE_TRANS,
    _a);
// providers
exports.TRANSLATION_PROVIDERS = [
    { provide: exports.TRANSLATIONS, useValue: dictionary },
];
var _a;
//# sourceMappingURL=translations.js.map