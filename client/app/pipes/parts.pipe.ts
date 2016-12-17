/**
 * Created by Paddy on 17.12.2016.
 */
import {Pipe} from '@angular/core';

// Tell Angular2 we're creating a Pipe with TypeScript decorators
@Pipe({
    name: 'partPipe'
})
export class PartPipe {
    transform(value, args?) {
        if (args === undefined || args === null || args === "") {
            return value;
        }
        return value.filter(part => {
            return part.bezeichnung.toUpperCase().includes(args.toUpperCase()) || part.nummer === Number.parseInt(args.toUpperCase());
        });
    }

}