import { Component } from '@angular/core';

@Component({
  selector: 'app-classificacao-page',
  templateUrl: './classificacao.component.html',
  styleUrls: ['./classificacao-card.component.css']
})
export class ClassificacaoPageComponent {
  classificacao: { nome: string; pontos: number; acertos: number }[] = [];
}
