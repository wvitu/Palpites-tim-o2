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

  atualizarPontuacao(pontos: { [nome: string]: number }) {
    console.log('Pontuações atualizadas:', pontos);
  }
}
