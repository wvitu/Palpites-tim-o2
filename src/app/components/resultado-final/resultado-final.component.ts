import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-resultado-final',
  templateUrl: './resultado-final.component.html',
  styleUrls: ['./resultado-final.component.css']
})
export class ResultadoFinalComponent {
  @Input() palpites: any = {};
  @Input() palpiteiros: string[] = [];
  @Output() pontuacoesAtualizadas = new EventEmitter<{ [nome: string]: number }>();

  resultadoCasa: string = '';
  resultadoVisitante: string = '';
  mensagensAcerto: string[] = [];

  verificarResultado() {
    const casa = this.resultadoCasa;
    const visitante = this.resultadoVisitante;

    if (casa === '' || visitante === '') {
      alert('Preencha os dois campos do resultado.');
      return;
    }

    const acertos: { [nome: string]: number } = {};
    this.mensagensAcerto = [];

    for (const nome of this.palpiteiros) {
      let pontos = 0;

      if (this.palpites[nome]) {
        const palpiteTorcedor = this.palpites[nome].torcedor;
        const palpiteRealista = this.palpites[nome].realista;

        if (palpiteTorcedor.casa === casa && palpiteTorcedor.visitante === visitante) {
          pontos++;
          this.mensagensAcerto.push(`Parabéns ${nome}, você acertou com o palpite torcedor!`);
        }

        if (palpiteRealista.casa === casa && palpiteRealista.visitante === visitante) {
          pontos++;
          this.mensagensAcerto.push(`Parabéns ${nome}, você acertou com o palpite realista!`);
        }
      }

      if (pontos > 0) {
        acertos[nome] = pontos;
      }
    }

    this.pontuacoesAtualizadas.emit(acertos);
  }
}
