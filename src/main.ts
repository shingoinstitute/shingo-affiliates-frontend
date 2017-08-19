import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

declare global {
  interface Date {
    withoutTime: () => Date;
  }
}

(function () {
  Date.prototype.withoutTime = function () {
    let d: Date = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
  }

}
)();
platformBrowserDynamic().bootstrapModule(AppModule);
