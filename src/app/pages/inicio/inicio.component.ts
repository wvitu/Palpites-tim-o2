import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private router: Router, private palpiteService: PalpiteService) {}

  async ngOnInit(): Promise<void> {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as any;

    if (state?.partida) {
      this.adversario = state.partida.adversario;
      this.dataHora = state.partida.dataHora;
      this.local = state.partida.local;
    }

    this.palpiteiros = await this.palpiteService.getMembrosGrupo();

    const ranking = await this.palpiteService.getRankingGrupo();
    this.pontuacao = {};
    for (const item of ranking) {
      this.pontuacao[item.nome] = {
        pontos: item.pontos,
        acertos: item.acertos
      };
    }
  }


  async carregarPalpiteiros() {
    this.palpiteiros = await this.palpiteService.getMembrosGrupo();
  }

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
