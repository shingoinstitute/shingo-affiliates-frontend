import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import { Routes, RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { CookieModule } from 'ngx-cookie';
import 'hammerjs';

/** Shared Modules */
import { SharedModule } from './shared/shared.module';
import { ServicesModule } from './services/services.module';

/** Workshops  */
import { WorkshopsModule } from './workshops/workshops.module';

/** Facilitators */
import { FacilitatorsModule } from './facilitators/facilitators.module';

/** Affiliates */
import { AffiliatesModule } from './affiliates/affiliates.module';

/** Interface Module */
import { InterfaceModule } from './interface/interface.module';

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
      ServicesModule.forRoot(),
      CookieModule.forRoot(),
      SharedModule.forRoot(),
      AppRoutingModule,
      FlexLayoutModule,
      InterfaceModule,
      WorkshopsModule,
      FacilitatorsModule,
      AffiliatesModule
   ],
   providers: [],
   bootstrap: [AppComponent]
})
export class AppModule { }
