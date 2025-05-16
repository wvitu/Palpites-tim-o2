import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PalpiteService } from 'src/app/services/palpite.service';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-resultado-final',
  templateUrl: './resultado-final.component.html',
  styleUrls: ['./resultado-final.component.css']
})
export class ResultadoFinalComponent {
  @Input() palpites: any = {};
  @Input() palpiteiros: string[] = [];
  @Input() adversario: string = '';
  @Input() dataHora: string = '';
  @Input() local: string = '';
  @Output() pontuacoesAtualizadas = new EventEmitter<{ [nome: string]: number }>();

  resultadoCasa: string = '';
  resultadoVisitante: string = '';
  mensagensAcerto: string[] = [];

  constructor(
    private palpiteService: PalpiteService,
    private firestore: Firestore,
    private auth: AuthService
  ) {}

  async verificarResultado() {
    const casa = parseInt(this.resultadoCasa);
    const visitante = parseInt(this.resultadoVisitante);

    if (isNaN(casa) || isNaN(visitante)) {
      alert('Preencha os dois campos do resultado com números.');
      return;
    }

    const acertos: { [nome: string]: number } = {};
    this.mensagensAcerto = [];

    for (const nome of this.palpiteiros) {
      let pontos = 0;

      if (this.palpites[nome]) {
        const palpiteTorcedor = this.palpites[nome].torcedor;
        const palpiteRealista = this.palpites[nome].realista;

        if (+palpiteTorcedor.casa === casa) {
          pontos++;
          this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do Corinthians (palpite torcedor).`);
        }
        if (+palpiteTorcedor.visitante === visitante) {
          pontos++;
          this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do adversário (palpite torcedor).`);
        }
        if (+palpiteTorcedor.casa === casa && +palpiteTorcedor.visitante === visitante) {
          pontos++;
          this.mensagensAcerto.push(`+1 ponto extra: ${nome} acertou o placar completo (palpite torcedor)!`);
        }

        if (+palpiteRealista.casa === casa) {
          pontos++;
          this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do Corinthians (palpite realista).`);
        }
        if (+palpiteRealista.visitante === visitante) {
          pontos++;
          this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do adversário (palpite realista).`);
        }
        if (+palpiteRealista.casa === casa && +palpiteRealista.visitante === visitante) {
          pontos++;
          this.mensagensAcerto.push(`+1 ponto extra: ${nome} acertou o placar completo (palpite realista)!`);
        }
      }

      if (pontos > 0) {
        acertos[nome] = pontos;
        this.palpiteService.atualizarRanking(nome, pontos);
      }
    }

    if (Object.keys(acertos).length === 0) {
      this.mensagensAcerto.push('Ninguém acertou desta vez.');
    }

    this.pontuacoesAtualizadas.emit(acertos);

    // 🔥 Salvar a partida com verificado: true no Firestore
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) return;

    const partidaId = new Date().getTime().toString(); // ou gere um ID único
    const partidaRef = doc(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}`);

    await setDoc(partidaRef, {
      adversario: this.adversario,
      dataHora: this.dataHora,
      local: this.local,
      resultadoCasa: casa,
      resultadoVisitante: visitante,
      verificado: true
    });
  }
}
