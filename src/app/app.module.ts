import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// COMPONENTES
import { HeaderComponent } from './components/header/header.component';
import { RodapeComponent } from './components/rodape/rodape.component';
import { MatchInfoComponent } from './components/match-info/match-info.component';
import { PalpitesComponent } from './components/palpites/palpites.component';
import { ResultadoFinalComponent } from './components/resultado-final/resultado-final.component';
import { ClassificacaoComponent } from './components/classificacao-card/classificacao-card.component';
import { EditarPalpiteCardComponent } from './components/editar-palpite-card/editar-palpite-card.component';

// PÁGINAS
import { InicioComponent } from './pages/inicio/inicio.component';
import { ClassificacaoPageComponent } from './pages/classificacao/classificacao.component';
import { LoginComponent } from './pages/login/login.component';
import { HistoricoComponent } from './historico/historico.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RodapeComponent,
    MatchInfoComponent,
    PalpitesComponent,
    ResultadoFinalComponent,
    ClassificacaoComponent,
    EditarPalpiteCardComponent,
    InicioComponent,
    ClassificacaoPageComponent,
    LoginComponent,
    HistoricoComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,

    // Firebase
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
