/**
 * Created by Paddy on 03.11.2016.
 */
import {Component} from '@angular/core';
import {CapacityPlanningService} from '../../services/capacityPlanning.service';
import {Workstation} from '../../model/workstastion';
import {ProcessingTime} from '../../model/processingTime';
import {Part} from '../../model/part';
import {ProdTime} from '../../model/prodTime';

@Component({
    moduleId: module.id,
    selector: 'capacityPlanning',
    templateUrl: 'capacityPlanning.component.html'
})

export class CapacityPlanningComponent {
    workstations: Workstation[];
    processingTimes: ProcessingTime[];
    parts: Part[];
    artikelListe: ProdTime[] = new Array<ProdTime>();

    constructor(private capacityPlanningService: CapacityPlanningService) {
    }

    ngOnInit() {
        this.capacityPlanningService.getWorkstations()
            .subscribe(workstations => {
                this.workstations = workstations;
                this.getTimesAndEPParts();
            });
    }

    getTimesAndEPParts() {
        this.capacityPlanningService.getTimesAndEPParts().subscribe(
            data => {
                this.processingTimes = data[0]
                this.parts = data[1]
            }
            ,
            err => console.error(err),
            () => this.generateRows())
    };


    generateRows() {
        for (var part of this.parts) {
            var zuweisung: Array<Array<number>> = new Array<Array<number>>();

            for (var pt of this.processingTimes) {
                var apZeit: number[] = [];
                if (pt.teil.nummer === part.nummer) {
                    apZeit.push(pt.arbeitsplatz.nummer);
                    apZeit.push(pt.fertigungsZeit);
                    apZeit.push(pt.ruestZeit);

                    zuweisung.push(apZeit);
                }
            }
            var prodTime = {
                part: part.nummer,
                zuweisung: zuweisung
            };
            this.artikelListe.push(prodTime);
        }
    }
}