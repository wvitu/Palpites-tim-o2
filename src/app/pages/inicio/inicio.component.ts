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

  pontuacao: { [nome: string]: { pontos: number; acertos: number } } = {};

  atualizarPontuacao(pontos: { [nome: string]: number }) {
    for (const nome in pontos) {
      if (!this.pontuacao[nome]) {
        this.pontuacao[nome] = { pontos: 0, acertos: 0 };
      }
      this.pontuacao[nome].pontos += pontos[nome];
      this.pontuacao[nome].acertos += 1;
    }
  }


  getClassificacao() {
    return Object.entries(this.pontuacao).map(([nome, dados]) => ({
      nome,
      pontos: dados.pontos,
      acertos: dados.acertos
    }));
  }

}
