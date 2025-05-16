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

  ngOnInit(): void {
    this.palpiteService.getRankingGrupo().then(ranking => {
      this.classificacao = ranking;
    });
  }
}
