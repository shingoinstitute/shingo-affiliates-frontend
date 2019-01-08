import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { StoreModule } from '@ngrx/store'
import { EffectsModule } from '@ngrx/effects'
import { LoginPageComponent } from './pages/login/login-page.component'
import { LoginFormComponent } from './components/login-form/login-form.component'

import { AuthEffects } from './effects/auth.effects'
import { reducers, ROOT_KEY } from './reducers'
// import { MaterialModule } from '../material'
import { AuthRoutingModule } from './auth-routing.module'
import {
  MatCardModule,
  MatInputModule,
  MatButtonModule,
} from '@angular/material'
import { FlexLayoutModule } from '@angular/flex-layout'

export const COMPONENTS = [LoginPageComponent, LoginFormComponent]

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // MaterialModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    AuthRoutingModule,
    StoreModule.forFeature(ROOT_KEY, reducers),
    EffectsModule.forFeature([AuthEffects]),
  ],
  declarations: COMPONENTS,
})
export class AuthModule {}
