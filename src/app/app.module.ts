import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MatchInfoComponent } from './match-info/match-info.component';
import { PalpitesComponent } from './palpites/palpites.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MatchInfoComponent,
    PalpitesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
