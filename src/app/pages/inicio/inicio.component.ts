import { Component } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  adversario: string = '';
  dataHora: string = '';
  local: string = '';
  palpiteiros: string[] = [];
  palpitesRef: any = {};

  atualizarJogo(info: { adversario: string, dataHora: string, local: string }) {
    this.adversario = info.adversario;
    this.dataHora = info.dataHora;
    this.local = info.local;
  }

  adicionarPalpiteiro(nome: string) {
    if (nome && !this.palpiteiros.includes(nome)) {
      this.palpiteiros = [...this.palpiteiros, nome];
    }
  }

  receberPalpites(palpites: any) {
    this.palpitesRef = palpites;
  }

  pontuacoes: { [nome: string]: number } = {};

  atualizarPontuacao(novosPontos: { [nome: string]: number }) {
    for (const [nome, pontos] of Object.entries(novosPontos)) {
      this.pontuacoes[nome] = (this.pontuacoes[nome] || 0) + pontos;
    }
  }
}
