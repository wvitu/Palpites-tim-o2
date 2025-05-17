import { Component, OnInit } from '@angular/core';
import { PalpiteService } from '../services/palpite.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  partidasConferidas: any[] = [];
  partidaSelecionada: any = null;

  constructor(private palpiteService: PalpiteService) {}

  ngOnInit(): void {
    this.carregarHistorico();
  }

  carregarHistorico(): void {
    this.palpiteService.getPartidasConferidas().then(partidas => {
      this.partidasConferidas = partidas.sort((a, b) =>
        new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
      );
    });
  }

  abrirEdicao(partida: any): void {
    this.partidaSelecionada = partida;
  }

  fecharEdicao(): void {
    this.partidaSelecionada = null;
  }
}
