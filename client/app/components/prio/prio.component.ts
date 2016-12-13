/**
 * Created by philipp.koepfer on 10.12.16.
 */
import { Component } from '@angular/core';

import {SessionService} from '../../services/session.service';
import {PartService} from '../../services/part.service';

import {Part} from '../../model/part';

@Component({
    moduleId: module.id,
    selector: 'prio',
    templateUrl: 'prio.component.html'
})
export class PrioComponent {
    selector = "";


    epParts : Array<Part> = [];
    pParts : Array<Part> = [];

    constructor(private sessionService: SessionService, private  partService: PartService) {
        this.partService.getEPParts()
            .subscribe(
                data => {
                    this.epParts = data;
                    for(var i = 0; i < data.length; i++){
                        console.log(data[i]);
                        if(data[i].typ === "P"){
                            this.pParts.push(data[i]);
                        }
                    }
                },
                err => console.error(err),
                () => console.log(this.pParts));
    }

}


/*
    15 Arbeitsplätze

    Max: 10800 min pro Periode
    Eine Schicht mit Überstunden sind 3600 min.

 1. Schicht 2.400 Minuten
 2. Schicht 2.400 Minuten
 3. Schicht 2.400 Minuten
 */