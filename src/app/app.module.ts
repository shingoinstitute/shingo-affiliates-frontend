import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '@angular/material';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CookieModule } from 'ngx-cookie';
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';

/** Shared Modules */
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';
import { IsValidResolver } from './services/auth/is-valid.resolver';
import { UserResolver } from './services/auth/user.resolver';

/** Workshops  */
import { WorkshopsModule } from './workshops/workshops.module';
import { WorkshopResolver } from './workshops/workshop.resolver';

/** Facilitators */
import { FacilitatorsModule } from './facilitators/facilitators.module';

/** Affiliates */
import { AffiliatesModule } from './affiliates/affiliates.module';

/** Interface Components */
import { WorkshopDetailComponent } from './interface/workshops/workshop-detail/workshop-detail.component';
import { InterfaceModule } from './interface/interface.module';
import { DashboardComponent } from './interface/dashboard/dashboard.component';
import { AddWorkshopComponent } from './interface/add-workshop/add-workshop.component';
import { EditWorkshopComponent } from './interface/edit-workshop/edit-workshop.component';
import { ProfileComponent } from './interface/profile/profile.component';
import { LoginComponent } from './interface/login/login.component';
import { SupportComponent } from './interface/support/support.component';
import { SupportTrainingComponent } from './interface/support/support-training/support-training.component';
import { WorkshopDashboardComponent } from './interface/workshop-dashboard/workshop-dashboard.component';

// App Components
import { AppComponent } from './app.component';

export const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'workshops/new', component: AddWorkshopComponent, resolve: { user: UserResolver } },
  { path: 'workshops/:id/edit', component: EditWorkshopComponent, resolve: { workshop: WorkshopResolver } },
  { path: 'workshops/:id', component: WorkshopDetailComponent, resolve: { workshop: WorkshopResolver } },
  { path: 'workshops', component: WorkshopDashboardComponent, canActivate: [IsValidResolver], resolve: { user: UserResolver } },
  { path: 'profile', component: ProfileComponent },
  { path: 'login', component: LoginComponent },
  { path: 'support', component: SupportComponent },
  { path: 'support/training', component: SupportTrainingComponent },
  { path: 'support/training/:video', component: SupportTrainingComponent }
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule,
    ServicesModule.forRoot(),
    SharedModule.forRoot(),
    CookieModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    FlexLayoutModule,
    InterfaceModule,
    WorkshopsModule,
    FacilitatorsModule,
    AffiliatesModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
