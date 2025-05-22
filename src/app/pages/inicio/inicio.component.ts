import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PalpiteService } from 'src/app/services/palpite.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  adversario: string = '';
  dataHora: string = '';
  local: string = '';
  partidaId: string = '';
  palpiteiros: string[] = [];
  palpitesRef: any = {};
  pontuacao: { [nome: string]: { pontos: number; acertos: number } } = {};

  partidasFuturas: any[] = [];
  selecionandoPartida: boolean = false;
  registrandoNovaPartida: boolean = false;

  constructor(
    private router: Router,
    private palpiteService: PalpiteService,
    public authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
  console.log('🔎 isAdmin? =>', this.authService.isAdminUser());
  console.log('🔎 Usuário atual:', this.authService.getUsuario());
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as any;

    if (state?.partida) {
      this.adversario = state.partida.adversario || '';
      this.dataHora = state.partida.dataHora || '';
      this.local = state.partida.local || '';
      this.partidaId = state.partida.id || '';

      if (state.partida.palpites) {
        this.palpiteiros = Object.keys(state.partida.palpites);
        this.palpitesRef = state.partida.palpites;
      }
    } else {
      const membros = await this.palpiteService.getMembrosGrupo();
      this.palpiteiros = membros.map(m => m.nome);

      // ✅ Carrega partidas futuras (não verificadas)
      this.partidasFuturas = await this.palpiteService.getPartidasNaoVerificadas();
    }

    await this.carregarRanking();
  }

  async carregarRanking() {
    const ranking = await this.palpiteService.getRankingAPartirDoHistorico();
    this.pontuacao = {};
    for (const item of ranking) {
      this.pontuacao[item.nome] = {
        pontos: item.pontos,
        acertos: item.acertos
      };
    }
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

  iniciarRegistroPartida() {
    this.registrandoNovaPartida = true;
    this.selecionandoPartida = false;
    this.limparPartidaAtual();
  }

  iniciarSelecaoPartidaExistente() {
    this.selecionandoPartida = true;
    this.registrandoNovaPartida = false;
  }

  selecionarPartida(partida: any) {
    this.adversario = partida.adversario;
    this.dataHora = partida.dataHora;
    this.local = partida.local;
    this.partidaId = partida.id;
    this.palpitesRef = partida.palpites || {};
    this.palpiteiros = Object.keys(this.palpitesRef);
    this.selecionandoPartida = false;
  }

  limparPartidaAtual() {
    this.adversario = '';
    this.dataHora = '';
    this.local = '';
    this.partidaId = '';
    this.palpitesRef = {};
  }
}
