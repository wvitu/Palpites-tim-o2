import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ClassificacaoPageComponent } from './pages/classificacao/classificacao.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { HistoricoComponent } from './historico/historico.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { LoginGuard } from './guards/login.guard';



const routes: Routes = [
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] },
  { path: '', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'classificacao', component: ClassificacaoPageComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
  { path: 'historico', component: HistoricoComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
