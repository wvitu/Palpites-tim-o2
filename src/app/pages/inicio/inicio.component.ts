import { Component, OnInit } from '@angular/core';
import { PalpiteService } from 'src/app/services/palpite.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  adversario: string = '';
  dataHora: string = '';
  local: string = '';
  palpiteiros: string[] = [];
  palpitesRef: any = {};
  pontuacao: { [nome: string]: { pontos: number; acertos: number } } = {};

  constructor(private palpiteService: PalpiteService) {}

  ngOnInit() {
    // Carrega membros
    this.palpiteService.getMembrosGrupo().then(membros => {
      this.palpiteiros = membros;
    }).catch(() => {
      console.warn('Nenhum membro encontrado ou não autenticado');
    });

    // Carrega ranking
    this.palpiteService.getRankingGrupo().then(ranking => {
      for (const item of ranking) {
        this.pontuacao[item.nome] = {
          pontos: item.pontos,
          acertos: item.acertos
        };
      }
    });
  }

  atualizarJogo(info: { adversario: string, dataHora: string, local: string }) {
    this.adversario = info.adversario;
    this.dataHora = info.dataHora;
    this.local = info.local;
  }

  adicionarPalpiteiro(nome: string) {
    nome = nome.trim();
    if (nome && !this.palpiteiros.includes(nome)) {
      this.palpiteiros = [...this.palpiteiros, nome];
      this.palpiteService.adicionarMembroGrupo(nome);
    }
  }

  receberPalpites(palpites: any) {
    this.palpitesRef = palpites;
  }

  atualizarPontuacao(pontos: { [nome: string]: number }) {
    for (const nome in pontos) {
      if (!this.pontuacao[nome]) {
        this.pontuacao[nome] = { pontos: 0, acertos: 0 };
      }
      this.pontuacao[nome].pontos += pontos[nome];
      this.pontuacao[nome].acertos += 1;
    }

    localStorage.setItem('pontuacao', JSON.stringify(this.pontuacao));
  }

  getClassificacao() {
    return Object.entries(this.pontuacao).map(([nome, dados]) => ({
      nome,
      pontos: dados.pontos,
      acertos: dados.acertos
    }));
  }
}
