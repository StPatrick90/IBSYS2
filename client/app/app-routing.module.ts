/**
 * Created by Paddy on 25.10.2016.
 */
import { NgModule }     from '@angular/core';
import { RouterModule } from '@angular/router';
import {TasksComponent} from './components/tasks/tasks.component';
import {HomeComponent} from './components/home/home.component';
//import {XMLUploadComponent} from './components/xmlUpload/xmlUpload.component';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: 'tasks', component: TasksComponent },
            { path: '', component: HomeComponent }

        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {}