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
  @Input() isAdmin: boolean = false;

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

    if (!this.isAdmin) {
      alert('Apenas o administrador pode verificar o resultado.');
      return;
    }

    if (isNaN(casa) || isNaN(visitante)) {
      alert('Preencha os dois campos do resultado com números.');
      return;
    }

    if (!this.adversario || !this.dataHora || !this.local) {
      alert('Preencha os dados da partida (adversário, data e local).');
      return;
    }

    const acertos: { [nome: string]: number } = {};
    this.mensagensAcerto = [];

    for (const nome of this.palpiteiros) {
      let pontos = 0;
      let acertosIndividuais = 0;

      const palpite = this.palpites[nome];
      if (!palpite) continue;

      const { torcedor, realista } = palpite;

      // Palpite Torcedor
      if (+torcedor.casa === casa) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do Corinthians (palpite torcedor).`);
      }
      if (+torcedor.visitante === visitante) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do adversário (palpite torcedor).`);
      }
      if (+torcedor.casa === casa && +torcedor.visitante === visitante) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto extra: ${nome} acertou o placar completo (palpite torcedor)!`);
      }

      // Palpite Realista
      if (+realista.casa === casa) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do Corinthians (palpite realista).`);
      }
      if (+realista.visitante === visitante) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do adversário (palpite realista).`);
      }
      if (+realista.casa === casa && +realista.visitante === visitante) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto extra: ${nome} acertou o placar completo (palpite realista)!`);
      }

      if (pontos > 0) {
        acertos[nome] = pontos;
        await this.palpiteService.atualizarRanking(nome, pontos, acertosIndividuais);
      }
    }

    if (Object.keys(acertos).length === 0) {
      this.mensagensAcerto.push('Ninguém acertou desta vez.');
    }

    this.pontuacoesAtualizadas.emit(acertos);

    // 🔒 Salvar resultado da partida
    const uidGrupo =this.auth.getGrupoId();
    if (!uidGrupo) {
      console.error('Grupo não autenticado');
      return;
    }

    const partidaId = this.gerarIdPartida();
    const partidaRef = doc(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}`);

    await setDoc(partidaRef, {
      adversario: this.adversario,
      dataHora: this.dataHora,
      local: this.local,
      resultadoCasa: casa,
      resultadoVisitante: visitante,
      verificado: true
    });

    console.log('Partida salva com sucesso:', partidaId);
  }

  private gerarIdPartida(): string {
    return `${this.dataHora}-${this.adversario}`.replace(/[^a-zA-Z0-9]/g, '_');
  }
}
