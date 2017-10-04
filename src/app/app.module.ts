import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpModule } from '@angular/http';
import { CookieModule } from 'ngx-cookie';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import 'hammerjs';

/** Shared Modules */
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';

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

// Providers
import { LoggerInterceptorProvider } from './interceptor.provider';

// Material Design imports
import { 
  MdMenuModule, 
  MdButtonModule,
  MdSidenavModule,
  MdToolbarModule,
  MdListModule,
  MdIconModule,
  MdProgressSpinnerModule
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MdMenuModule,
    MdButtonModule,
    MdSidenavModule,
    MdToolbarModule,
    MdListModule,
    MdIconModule,
    MdProgressSpinnerModule,

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
    useFactory: LoggerInterceptorProvider,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
