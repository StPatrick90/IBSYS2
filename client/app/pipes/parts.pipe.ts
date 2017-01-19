/**
 * Created by Paddy on 17.12.2016.
 */
import {Pipe} from '@angular/core';
import {TranslatePipe} from '../translate/translate.pipe';

// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
    name: 'partPipe'
})
export class PartPipe {
    constructor(private translatePipe:TranslatePipe){

    }
    transform(value, args?) {
        if (args === undefined || args === null || args === "") {
            return value;
        }
        return value.filter(part => {
            return part.bezeichnung.toUpperCase().includes(args.toUpperCase()) || part.nummer === Number.parseInt(args.toUpperCase()) || this.translatePipe.transform(part.bezeichnung.toString(), null).toUpperCase().includes(args.toUpperCase());
        });
    }

}