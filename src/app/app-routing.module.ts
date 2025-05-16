import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ClassificacaoPageComponent } from './pages/classificacao/classificacao.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HistoricoComponent } from './historico/historico.component';


const routes: Routes = [
  { path: '', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'classificacao', component: ClassificacaoPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'historico', component: HistoricoComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
