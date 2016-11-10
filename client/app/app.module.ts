/**
 * Created by Paddy on 21.10.2016.
 */
import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {TasksComponent} from './components/tasks/tasks.component';

import {XmlImportComponent} from './components/xmlImport/xmlImport.component';


import {CapacityPlanningComponent} from './components/capacityPlanning/capacityPlanning.component';
import {MaterialPlanningComponent} from './components/materialPlanning/materialPlanning.component';

//import { XMLUploadComponent} from './components/xmlUpload/xmlUpload.component';
import {HomeComponent} from './components/home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {TranslatePipe}   from './translate/translate.pipe';
import {TranslateService}   from './translate/translate.service';
import {TRANSLATION_PROVIDERS} from './translate/index';

@NgModule({
    imports: [BrowserModule, HttpModule, FormsModule, AppRoutingModule],

    declarations: [AppComponent, TasksComponent, CapacityPlanningComponent, HomeComponent, TranslatePipe, XmlImportComponent, MaterialPlanningComponent],

    bootstrap: [AppComponent],
    providers: [TRANSLATION_PROVIDERS, TranslateService]

})
export class AppModule {
}
