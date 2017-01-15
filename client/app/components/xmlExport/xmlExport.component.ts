/**
 * Created by philipp.koepfer on 15.01.17.
 */

import { Component, Input } from '@angular/core';
import { XmlImportService } from '../../services/xmlImport.service';
import { WindowRef } from '../../services/window.service';
import { SessionService } from '../../services/session.service';
import { DBService} from '../../services/db.service';
import { AppService} from '../../services/app.service';


@Component({
    moduleId: module.id,
    selector: 'xmlExport',
    templateUrl: 'xmlExport.component.html'
})
export class XmlExportComponent {

    prioOutput: Array<any> = [];

    jsonString: string = "";

    constructor(private sessionService: SessionService){

    }

    ngOnInit() {
        this.prioOutput = this.sessionService.getPrioOutput();
        this.jsonString = JSON.stringify(this.prioOutput);
    }

}
