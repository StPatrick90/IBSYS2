/**
 * Created by Paddy on 04.01.2017.
 */
import {Component} from '@angular/core';
import {PartService} from '../../../services/part.service';
import {SessionService} from '../../../services/session.service';
import {Part} from '../../../model/part';

@Component({
    moduleId: module.id,
    selector: 'kPartAllocation',
    templateUrl: 'kPartAllocation.component.html'
})

export class KPartAllocationComponent {
    parts : Array<Part>;
    kparts : Array<Part>;
    searchText : any;

    partAllocation : Array<Array<any>> = new Array<Array<any>>();

    constructor(private partService:PartService, private sessionService:SessionService) {
        if (this.sessionService.getParts()) {
            this.parts = this.sessionService.getParts();
            this.kparts = this.sessionService.getParts().filter(item => item.typ == "K");
            this.initAll();
        }
        else {
            this.partService.getParts()
                .subscribe(parts => {
                        this.parts = parts;
                        this.kparts = parts.filter(item => item.typ == "K");
                    },
                    err => console.error(err),
                    () => this.initAll());
        }
    }

    initAll(){
        for(let kpart of this.kparts){
            for(let part of this.parts){
                for(let bestandteil of part.bestandteile) {
                    if (bestandteil._id === kpart._id) {
                        if(!this.partAllocation[kpart.nummer]){
                            this.partAllocation[kpart.nummer] = [];
                        }
                        this.partAllocation[kpart.nummer].push(part);
                    }
                }
            }
        }
    }
}