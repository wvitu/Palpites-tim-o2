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
    if (!nome.trim()) return;
    if (this.palpiteiros.includes(nome)) {
      alert('Palpiteiro já adicionado!');
      return;
    }
    if (this.palpiteiros.length >= 10) {
      alert('Limite de 10 palpiteiros atingido.');
      return;
    }
    this.palpiteiros.push(nome.trim());

  }
}
