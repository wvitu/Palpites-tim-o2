import { HttpClientModule } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- IMPORTANTE!
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { RodapeComponent } from './components/rodape/rodape.component';
import { MatchInfoComponent } from './components/match-info/match-info.component';
import { PalpitesComponent } from './components/palpites/palpites.component';
import { ResultadoFinalComponent } from './components/resultado-final/resultado-final.component';
import { ClassificacaoComponent } from './components/classificacao-card/classificacao-card.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ClassificacaoPageComponent } from './pages/classificacao/classificacao.component';
import { LoginComponent } from './pages/login/login.component';
import { HistoricoComponent } from './historico/historico.component';
import { RouterModule } from '@angular/router';
import { EditarPalpiteCardComponent } from './components/editar-palpite-card/editar-palpite-card.component';
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
    InicioComponent,
    ClassificacaoPageComponent,
    LoginComponent,
    HistoricoComponent,
    EditarPalpiteCardComponent,
    AdminDashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule, // <-- IMPORTAR AQUI!
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
provideFirestore(() => getFirestore()),
provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
