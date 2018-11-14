import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './core/pages/main/app.component'
import { StoreModule } from '@ngrx/store'
import { reducers, metaReducers } from './reducers'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { environment } from '../environments/environment'
import { EffectsModule } from '@ngrx/effects'
import { AuthModule } from './auth/auth.module'
import { SuccessComponent } from './success.component'
import { JwtModule } from '@auth0/angular-jwt'
import { tokenGetter } from './auth/services/auth.service'
import { HttpClientModule } from '@angular/common/http'
import { CoreModule } from './core/core.module'
import { CommonModule } from '@angular/common'
import { UserModule } from './user/user.module'
import { SharedModule } from './shared/shared.module'

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
          environment.apiDomain,
          environment.clientDomain,
          environment.authApiDomain,
        ],
      },
    }),
    SharedModule,
    AuthModule,
    UserModule,
    AppRoutingModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    EffectsModule.forRoot([]),
    CoreModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
