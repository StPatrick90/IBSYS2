/**
 * Created by Paddy on 25.10.2016.
 */
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import {TasksComponent} from './components/tasks/tasks.component';
import {CapacityPlanningComponent} from './components/capacityPlanning/capacityPlanning.component';
import {HomeComponent} from './components/home/home.component';
import {XmlImportComponent} from './components/xmlImport/xmlImport.component';
import {MaterialPlanningComponent} from './components/materialPlanning/materialPlanning.component';
import {PredictionComponent} from './components/prediction/prediction.component';
import {WorkstationsComponent} from './components/settings/workstations/workstations.component';
import {PartsComponent} from './components/settings/parts/parts.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {PartsListsComponent} from './components/settings/partsLists/partsLists.component';
import { PrioComponent } from './components/prio/prio.component';
import {MaterialPlanningEPComponent} from './components/materialPlanningEP/materialPlanningEP.component';
import { WarehousestockComponent } from './components/overview/warehousestock/warehousestock.component';
import { KPartAllocationComponent } from './components/overview/kPartAllocation/kPartAllocation.component';
import { ForecastComponent } from './components/forecast/forecast.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'prediction', component: PredictionComponent },
            { path: 'xmlImport', component: XmlImportComponent},
            { path: 'tasks', component: TasksComponent },
            { path: 'capacityPlanning', component: CapacityPlanningComponent },
            { path: '', component: HomeComponent },
            { path: 'materialPlanning', component: MaterialPlanningComponent},
            { path: 'workstations', component: WorkstationsComponent},
            { path: 'parts', component: PartsComponent},
            { path: 'dashboard', component: DashboardComponent},
            { path: 'partsLists', component: PartsListsComponent},
            { path: 'prioritization', component: PrioComponent},
            { path: 'materialPlanningEP', component: MaterialPlanningEPComponent},
            { path: 'warehousestock', component: WarehousestockComponent},
            { path: 'kpartAllocation', component: KPartAllocationComponent},
            { path: 'forecast', component: ForecastComponent}
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}