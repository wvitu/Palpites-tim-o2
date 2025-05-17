import { Component, OnInit } from '@angular/core';
import { PalpiteService } from 'src/app/services/palpite.service';

@Component({
  selector: 'app-classificacao-page',
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao.component.css']
})
export class ClassificacaoPageComponent implements OnInit {
  classificacao: { nome: string; pontos: number; acertos: number }[] = [];

  constructor(private palpiteService: PalpiteService) {}

  async ngOnInit(): Promise<void> {
    this.classificacao = await this.palpiteService.getRankingAPartirDoHistorico();

    // Ordenar por pontuação e depois acertos
    this.classificacao.sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos);
  }
}
