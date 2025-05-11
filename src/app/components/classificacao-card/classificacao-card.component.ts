import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-classificacao',
  templateUrl: './classificacao-card.component.html',
  styleUrls: ['./classificacao-card.component.css']
})
export class ClassificacaoComponent {
  @Input() classificacao: { nome: string; pontos: number; acertos: number }[] = [];

  get classificacaoOrdenada() {
    return this.classificacao
      .slice()
      .sort((a, b) => b.pontos - a.pontos || b.acertos - a.acertos);
  }
}
