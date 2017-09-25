import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';
import { CookieModule } from 'ngx-cookie';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import 'hammerjs';

/** Shared Modules */
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { LoggerInterceptor } from './services/http/logger.interceptor';
import { NoopInterceptor } from './services/http/noop.interceptor';

/** Facilitators */
import { FacilitatorsModule } from './facilitators/facilitators.module';

/** Affiliates */
import { AffiliatesModule } from './affiliates/affiliates.module';

/** Workshops */
import { WorkshopsModule } from './workshops/workshops.module';

/** Interface Components */
import { UIComponentsModule } from './ui-components/ui-components.module';

// App Routing Module
import { AppRoutingModule } from './app-routing.module';

// App Components
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpModule,
    HttpClientModule,
    ServicesModule.forRoot(),
    CookieModule.forRoot(),
    FlexLayoutModule,
    SharedModule.forRoot(),
    AppRoutingModule,
    AffiliatesModule,
    FacilitatorsModule,
    WorkshopsModule,
    UIComponentsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useFactory() {
      if (isDevMode()) { return new LoggerInterceptor(); }
      return new NoopInterceptor();
    },
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
