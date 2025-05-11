import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao-card.component.html',
  styleUrls: ['./classificacao-card.component.css']
})
export class ClassificacaoComponent implements OnChanges {
  @Input() pontuacoes: { [nome: string]: number } = {};
  ranking: { nome: string; pontos: number }[] = [];

  ngOnChanges(): void {
    this.ranking = Object.entries(this.pontuacoes)
      .map(([nome, pontos]) => ({ nome, pontos }))
      .sort((a, b) => b.pontos - a.pontos);
  }
}
