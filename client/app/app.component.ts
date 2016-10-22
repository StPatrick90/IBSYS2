/**
 * Created by Paddy on 21.10.2016.
 */
import { Component } from '@angular/core';
import { TaskService } from './services/task.service';
import { AppService} from './services/app.service';


@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: 'app.component.html',
    providers: [TaskService, AppService]
})
export class AppComponent {
    mobileView:number = 992;
    toggle: boolean = false;

    constructor(private appService:AppService){
        this.attachEvents();
    }

    toggleSidebar(){
        this.toggle = !this.toggle;
        this.appService.toggleSidebar(this.toggle);
    }

    attachEvents() {
        window.onresize = ()=> {
            if (this.getWidth() >= this.mobileView) {
                if (localStorage.getItem('toggle')) {
                    this.toggle = !localStorage.getItem('toggle') ? false : true;
                } else {
                    this.toggle = true;
                }
            } else {
                this.toggle = false;
            }
        }
    }

    getWidth() {
        return window.innerWidth;
    }
}

