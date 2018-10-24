import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout'
import { CookieModule } from 'ngx-cookie'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

/** Shared Modules */
import { SharedModule } from './shared/shared.module'
import { ServicesModule } from './services/services.module'

/** Facilitators */
import { FacilitatorsModule } from './facilitators/facilitators.module'

/** Affiliates */
import { AffiliatesModule } from './affiliates/affiliates.module'

/** Workshops */
import { WorkshopsModule } from './workshops/workshops.module'

/** Support */
import { SupportModule } from './support/support.module'

/** Interface Components */
import { UIComponentsModule } from './ui-components/ui-components.module'

// App Routing Module
import { AppRoutingModule } from './app-routing.module'

// App Components
import { AppComponent } from './app.component'

// Providers
import { LoggerInterceptorProvider } from './interceptor.provider'

// Material Design imports
import {
  MatMenuModule,
  MatButtonModule,
  MatSidenavModule,
  MatToolbarModule,
  MatListModule,
  MatIconModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
} from '@angular/material'
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MatMomentDateAdapterOptions,
} from '@angular/material-moment-adapter'
import { LayoutModule } from '@angular/cdk/layout'

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,

    HttpClientModule,
    ServicesModule.forRoot(),
    CookieModule.forRoot(),
    FlexLayoutModule,
    SharedModule.forRoot(),
    AppRoutingModule,
    AffiliatesModule,
    FacilitatorsModule,
    WorkshopsModule,
    UIComponentsModule,
    SupportModule,
    LayoutModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useFactory: LoggerInterceptorProvider,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
