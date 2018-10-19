import 'hammerjs'
import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'

import { AppModule } from './app/app.module'
import { environment } from './environments/environment'

if (environment.production) {
  enableProdMode()
}

;(() => {
  Date.prototype.withoutTime = function() {
    const d: Date = new Date(this)
    d.setHours(0, 0, 0, 0)
    return d
  }
})()

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err))
