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
    ClassificacaoPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule, // <-- IMPORTAR AQUI!
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
provideFirestore(() => getFirestore()),
provideAuth(() => getAuth()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
