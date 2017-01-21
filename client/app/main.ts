/**
 * Created by Paddy on 21.10.2016.
 */
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import 'rxjs/add/operator/map';

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);

