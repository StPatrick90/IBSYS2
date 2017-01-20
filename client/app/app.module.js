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
var home_component_1 = require('./components/home/home.component');
var dashboard_component_1 = require('./components/dashboard/dashboard.component');
var app_routing_module_1 = require('./app-routing.module');
var translate_pipe_1 = require('./translate/translate.pipe');
var translate_service_1 = require('./translate/translate.service');
var index_1 = require('./translate/index');
var prediction_component_1 = require('./components/prediction/prediction.component');
var workstations_component_1 = require('./components/settings/workstations/workstations.component');
var parts_component_1 = require('./components/settings/parts/parts.component');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var multiselect_dropdown_1 = require('angular-2-dropdown-multiselect/src/multiselect-dropdown');
var LocalStorageEmitter_1 = require("angular2-localstorage/LocalStorageEmitter");
var ng2_dnd_1 = require('ng2-dnd');
var partsLists_component_1 = require('./components/settings/partsLists/partsLists.component');
var prio_component_1 = require('./components/prio/prio.component');
var parts_pipe_1 = require('./pipes/parts.pipe');
var materialPlanningEP_component_1 = require('./components/materialPlanningEP/materialPlanningEP.component');
var warehousestock_component_1 = require('./components/overview/warehousestock/warehousestock.component');
var ng2_charts_1 = require('ng2-charts/ng2-charts');
var kPartAllocation_component_1 = require('./components/overview/kPartAllocation/kPartAllocation.component');
var forecast_component_1 = require('./components/forecast/forecast.component');
var xmlExport_component_1 = require('./components/xmlExport/xmlExport.component');
var WINDOW_PROVIDER = {
    provide: Window,
    useValue: window
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, http_1.HttpModule, forms_1.FormsModule, app_routing_module_1.AppRoutingModule, ng2_bs3_modal_1.Ng2Bs3ModalModule,
                multiselect_dropdown_1.MultiselectDropdownModule, ng2_dnd_1.DndModule.forRoot(), ng2_charts_1.ChartsModule],
            declarations: [app_component_1.AppComponent, tasks_component_1.TasksComponent, capacityPlanning_component_1.CapacityPlanningComponent,
                home_component_1.HomeComponent, translate_pipe_1.TranslatePipe, xmlImport_component_1.XmlImportComponent, materialPlanning_component_1.MaterialPlanningComponent,
                prediction_component_1.PredictionComponent, workstations_component_1.WorkstationsComponent, parts_component_1.PartsComponent, dashboard_component_1.DashboardComponent,
                partsLists_component_1.PartsListsComponent, prio_component_1.PrioComponent, parts_pipe_1.PartPipe, materialPlanningEP_component_1.MaterialPlanningEPComponent,
                warehousestock_component_1.WarehousestockComponent, kPartAllocation_component_1.KPartAllocationComponent, forecast_component_1.ForecastComponent, xmlExport_component_1.XmlExportComponent],
            bootstrap: [app_component_1.AppComponent],
            providers: [index_1.TRANSLATION_PROVIDERS, translate_service_1.TranslateService, LocalStorageEmitter_1.LocalStorageService, WINDOW_PROVIDER, translate_pipe_1.TranslatePipe]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map