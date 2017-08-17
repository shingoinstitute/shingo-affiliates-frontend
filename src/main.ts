import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

console.log('Setting up AppModule');
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

console.log('Bootstraping AppModule');
platformBrowserDynamic().bootstrapModule(AppModule);
