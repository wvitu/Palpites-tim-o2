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
  @Input() isAdmin: boolean = false;
  @Input() partidaId: string = ''; // necessário para salvar resultado no lugar correto

  @Output() pontuacoesAtualizadas = new EventEmitter<{ [nome: string]: number }>();

  resultadoCasa: string = '';
  resultadoVisitante: string = '';
  mensagensAcerto: string[] = [];

  mensagemSucesso: string = '';
  mensagemErro: string = '';

  constructor(
    private palpiteService: PalpiteService,
    private firestore: Firestore,
    private auth: AuthService
  ) {}

  async confirmarResultado() {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
    const casa = parseInt(this.resultadoCasa);
    const visitante = parseInt(this.resultadoVisitante);

    if (!this.isAdmin) {
      this.mensagemErro = 'Apenas o administrador pode confirmar o resultado.';
      return;
    }

    if (isNaN(casa) || isNaN(visitante)) {
      this.mensagemErro = 'Preencha os dois campos do resultado com números válidos.';
      return;
    }

    if (!this.adversario || !this.dataHora || !this.local) {
      this.mensagemErro = 'Preencha os dados da partida (adversário, data e local).';
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

      if (+torcedor.casa === casa) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do Corinthians (torcedor).`);
      }
      if (+torcedor.visitante === visitante) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do adversário (torcedor).`);
      }
      if (+torcedor.casa === casa && +torcedor.visitante === visitante) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 extra: ${nome} acertou o placar completo (torcedor)!`);
      }

      if (+realista.casa === casa) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do Corinthians (realista).`);
      }
      if (+realista.visitante === visitante) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 ponto: ${nome} acertou o placar do adversário (realista).`);
      }
      if (+realista.casa === casa && +realista.visitante === visitante) {
        pontos++; acertosIndividuais++;
        this.mensagensAcerto.push(`+1 extra: ${nome} acertou o placar completo (realista)!`);
      }

      if (pontos > 0) {
        acertos[nome] = pontos;
        await this.palpiteService.atualizarRanking(nome, pontos, acertosIndividuais);
      }
    }

    if (Object.keys(acertos).length === 0) {
      this.mensagensAcerto.push('Ninguém pontuou nesta rodada.');
    }

    this.pontuacoesAtualizadas.emit(acertos);

    // 🔒 Salvar resultado final
    const uidGrupo = this.auth.getGrupoId();
    if (!uidGrupo) {
      this.mensagemErro = 'Grupo não autenticado.';
      return;
    }

    const partidaRef = doc(this.firestore, `grupos/${uidGrupo}/partidas/${this.partidaId}`);
    await setDoc(partidaRef, {
      adversario: this.adversario,
      dataHora: this.dataHora,
      local: this.local,
      resultadoCasa: casa,
      resultadoVisitante: visitante,
      verificado: true
    }, { merge: true });

    this.mensagemSucesso = 'Resultado confirmado e ranking atualizado!';
  }
}
