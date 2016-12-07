/**
 * Created by Paddy on 07.12.2016.
 */
import {Component} from '@angular/core';
import {SessionService} from '../../../services/session.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import {Part} from '../../../model/part';
import {PartService} from '../../../services/part.service';
import {SessionService} from '../../../services/session.service';

@Component({
    moduleId: module.id,
    selector: 'partsLists',
    templateUrl: 'partsLists.component.html'
})
export class PartsListsComponent {
    parts: Part[];

    constructor(private partservice: PartService, private sessionService: SessionService) {
        if (this.sessionService.getParts() != null || this.sessionService.getParts() != undefined) {
            this.parts = this.sessionService.getParts();
        }
        else {
            this.partservice.getParts()
                .subscribe(parts => {
                        this.parts = parts
                    });
        }
    }


}