import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ClassificacaoPageComponent } from './pages/classificacao/classificacao.component';

const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'classificacao', component: ClassificacaoPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
