import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-resultado-final',
  templateUrl: './resultado-final.component.html',
  styleUrls: ['./resultado-final.component.css']
})
export class ResultadoFinalComponent {
  @Input() palpiteiros: string[] = [];
  @Input() palpites: any = {};
  @Output() pontuacoesAtualizadas = new EventEmitter<{ [nome: string]: number }>();

  resultadoCasa = '';
  resultadoVisitante = '';
  mensagensAcerto: string[] = [];

  verificarResultado() {
    if (this.resultadoCasa === '' || this.resultadoVisitante === '') {
      alert('Preencha o placar corretamente.');
      return;
    }

    this.mensagensAcerto = [];
    const pontos: { [nome: string]: number } = {};

    for (const nome of this.palpiteiros) {
      let acertos = 0;
      const palpite = this.palpites[nome];
      if (!palpite) continue;

      if (palpite.torcedor.casa === this.resultadoCasa && palpite.torcedor.visitante === this.resultadoVisitante) {
        acertos++;
        this.mensagensAcerto.push(`Parabéns ${nome}, você acertou com o palpite torcedor!`);
      }

      if (palpite.realista.casa === this.resultadoCasa && palpite.realista.visitante === this.resultadoVisitante) {
        acertos++;
        this.mensagensAcerto.push(`Parabéns ${nome}, você acertou com o palpite realista!`);
      }

      if (acertos > 0) {
        pontos[nome] = acertos;
      }
    }

    this.pontuacoesAtualizadas.emit(pontos);
  }
}
