import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FlexLayoutModule } from '@angular/flex-layout'
// import { CookieModule } from 'ngx-cookie'
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
import { LayoutModule } from '@angular/cdk/layout'
import { CommonModule } from '@angular/common'
import { JwtModule } from '@auth0/angular-jwt'
import { tokenGetter } from './auth/services/auth.service'
import { environment } from '../environments/environment'
import { AuthModule } from './auth/auth.module'
import { StoreModule } from '@ngrx/store'
import { reducers, metaReducers } from './reducers'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { EffectsModule } from '@ngrx/effects'
import { UserModule } from './user/user.module'
import { AppComponent } from './core/pages/main/app.component'
import { CoreModule } from './core/core.module'
import { SuccessComponent } from './success.component'
import { StoreRouterConnectingModule } from '@ngrx/router-store'

@NgModule({
  declarations: [SuccessComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,

    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        whitelistedDomains: [
          environment.clientDomain,
          environment.apiDomain,
          environment.authApiDomain,
        ],
      },
    }),
    AuthModule,
    UserModule,
    CoreModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),

    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,

    ServicesModule.forRoot(),
    // CookieModule.forRoot(),
    FlexLayoutModule,
    SharedModule.forRoot(),
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
