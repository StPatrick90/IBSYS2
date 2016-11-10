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
 * Created by Paddy on 21.10.2016.
 */
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var app_component_1 = require('./app.component');
var tasks_component_1 = require('./components/tasks/tasks.component');
var xmlImport_component_1 = require('./components/xmlImport/xmlImport.component');
var capacityPlanning_component_1 = require('./components/capacityPlanning/capacityPlanning.component');
var materialPlanning_component_1 = require('./components/materialPlanning/materialPlanning.component');
//import { XMLUploadComponent} from './components/xmlUpload/xmlUpload.component';
var home_component_1 = require('./components/home/home.component');
var app_routing_module_1 = require('./app-routing.module');
var translate_pipe_1 = require('./translate/translate.pipe');
var translate_service_1 = require('./translate/translate.service');
var index_1 = require('./translate/index');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, app_routing_module_1.AppRoutingModule],
            declarations: [app_component_1.AppComponent, tasks_component_1.TasksComponent, capacityPlanning_component_1.CapacityPlanningComponent, home_component_1.HomeComponent, translate_pipe_1.TranslatePipe, xmlImport_component_1.XmlImportComponent, materialPlanning_component_1.MaterialPlanningComponent],
            bootstrap: [app_component_1.AppComponent],
            providers: [index_1.TRANSLATION_PROVIDERS, translate_service_1.TranslateService]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map