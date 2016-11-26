/**
 * Created by Paddy on 21.10.2016.
 */
import {NgModule, ValueProvider}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {TasksComponent} from './components/tasks/tasks.component';
import {XmlImportComponent} from './components/xmlImport/xmlImport.component';
import {CapacityPlanningComponent} from './components/capacityPlanning/capacityPlanning.component';
import {MaterialPlanningComponent} from './components/materialPlanning/materialPlanning.component';
import {HomeComponent} from './components/home/home.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {AppRoutingModule} from './app-routing.module';
import {TranslatePipe}   from './translate/translate.pipe';
import {TranslateService}   from './translate/translate.service';
import {TRANSLATION_PROVIDERS} from './translate/index';
import { PredictionComponent } from './components/prediction/prediction.component';
import { WorkstationsComponent } from './components/settings/workstations/workstations.component';
import { PartsComponent} from './components/settings/parts/parts.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import {MultiselectDropdownModule} from 'angular-2-dropdown-multiselect/src/multiselect-dropdown';
import {LocalStorageService} from "angular2-localstorage/LocalStorageEmitter";
import {DndModule} from 'ng2-dnd';

const WINDOW_PROVIDER: ValueProvider = {
    provide: Window,
    useValue: window
};

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, AppRoutingModule, Ng2Bs3ModalModule,
        MultiselectDropdownModule, DndModule.forRoot()],

    declarations: [AppComponent, TasksComponent, CapacityPlanningComponent,
        HomeComponent, TranslatePipe, XmlImportComponent, MaterialPlanningComponent,
        PredictionComponent, WorkstationsComponent, PartsComponent, DashboardComponent],

    bootstrap: [AppComponent],
    providers: [TRANSLATION_PROVIDERS, TranslateService, LocalStorageService, WINDOW_PROVIDER]

})
export class AppModule {
    constructor(){
    }
}
