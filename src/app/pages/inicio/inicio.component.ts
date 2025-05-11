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
  palpiteiros: string[] = [];

  onJogoAtualizado(dados: { adversario: string; dataHora: string; local: string }) {
    this.adversario = dados.adversario;
    this.dataHora = dados.dataHora;
    this.local = dados.local;
  }

  adicionarPalpiteiro(nome: string) {
    if (nome && !this.palpiteiros.includes(nome)) {
      this.palpiteiros.push(nome);
    }
  }
}
