/**
 * Created by Paddy on 21.10.2016.
 */
import { Component } from '@angular/core';
import { TaskService } from './services/task.service';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [TaskService]
})
export class AppComponent { }

