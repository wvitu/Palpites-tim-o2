import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  adversario = '';
  dataHora = '';
  local = '';

  aoAtualizarJogo(dados: { adversario: string; dataHora: string; local: string }) {
    this.adversario = dados.adversario;
    this.dataHora = dados.dataHora;
    this.local = dados.local;
  }
}
