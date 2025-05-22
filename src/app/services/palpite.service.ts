import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
  query,
  where,
  updateDoc
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PalpiteService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  getUidGrupo(): string | null {
    return this.auth.getGrupoId();
  }

  private getUidGrupoOrThrow(): string {
    const uidGrupo = this.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');
    return uidGrupo;
  }

  async salvarPalpite(partidaId: string, nomePalpiteiro: string, palpite: any): Promise<void> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const ref = doc(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}/palpites/${nomePalpiteiro}`);
    const dadosComNomeExibicao = {
      ...palpite,
      nomeExibicao: this.auth.getUsuario() // Nome legível do palpiteiro
    };
    await setDoc(ref, dadosComNomeExibicao, { merge: true });
  }

  async atualizarRanking(nome: string, pontos: number, acertos: number): Promise<void> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const ref = doc(this.firestore, `grupos/${uidGrupo}/ranking/${nome}`);
    const docSnap = await getDoc(ref);

    let dados = { pontos: 0, acertos: 0 };
    if (docSnap.exists()) {
      dados = docSnap.data() as any;
    }

    dados.pontos += pontos;
    dados.acertos += acertos;

    await setDoc(ref, dados);
  }

  async getMembrosGrupo(): Promise<{ nome: string; admin: boolean }[]> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const membrosRef = collection(this.firestore, `grupos/${uidGrupo}/membros`);
    const snapshot = await getDocs(membrosRef);

    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        nome: doc.id,
        admin: data['admin'] || false
      };
    });
  }

  async getRankingAPartirDoHistorico(): Promise<{ nome: string; pontos: number; acertos: number }[]> {
    const partidas = await this.getPartidasConferidas();

    const ranking: { [nome: string]: { pontos: number; acertos: number } } = {};

    for (const partida of partidas) {
      for (const palpite of partida.palpites || []) {
        const nome = palpite.nome;
        let pontos = 0;
        let acertos = 0;

        // Torcedor
        if (+palpite.torcedor?.casa === partida.resultadoCasa) pontos++, acertos++;
        if (+palpite.torcedor?.visitante === partida.resultadoVisitante) pontos++, acertos++;
        if (
          +palpite.torcedor?.casa === partida.resultadoCasa &&
          +palpite.torcedor?.visitante === partida.resultadoVisitante
        ) pontos++, acertos++;

        // Realista
        if (+palpite.realista?.casa === partida.resultadoCasa) pontos++, acertos++;
        if (+palpite.realista?.visitante === partida.resultadoVisitante) pontos++, acertos++;
        if (
          +palpite.realista?.casa === partida.resultadoCasa &&
          +palpite.realista?.visitante === partida.resultadoVisitante
        ) pontos++, acertos++;

        if (!ranking[nome]) {
          ranking[nome] = { pontos: 0, acertos: 0 };
        }

        ranking[nome].pontos += pontos;
        ranking[nome].acertos += acertos;
      }
    }

    return Object.entries(ranking).map(([nome, dados]) => ({
      nome,
      pontos: dados.pontos,
      acertos: dados.acertos
    }));
  }

  async getPartidasConferidas(): Promise<any[]> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const partidasRef = collection(this.firestore, `grupos/${uidGrupo}/partidas`);
    const q = query(partidasRef, where('verificado', '==', true));
    const snapshot = await getDocs(q);

    const partidas: any[] = [];

    for (const docSnap of snapshot.docs) {
      const partidaId = docSnap.id;
      const partida = docSnap.data();

      if (!partida) continue;

      const palpitesRef = collection(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}/palpites`);
      const palpitesSnap = await getDocs(palpitesRef);
      const palpites = palpitesSnap.docs.map(p => ({ nome: p.id, ...p.data() }));

      partidas.push({
        id: partidaId,
        adversario: partida['adversario'] || null,
        dataHora: partida['dataHora'] || null,
        local: partida['local'] || null,
        resultadoCasa: partida['resultadoCasa'] ?? null,
        resultadoVisitante: partida['resultadoVisitante'] ?? null,
        palpites
      });
    }

    return partidas;
  }

  async excluirPartida(partidaId: string): Promise<void> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const palpitesRef = collection(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}/palpites`);
    const palpitesSnap = await getDocs(palpitesRef);
    for (const docPalpite of palpitesSnap.docs) {
      await deleteDoc(docPalpite.ref);
    }
    const partidaRef = doc(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}`);
    await deleteDoc(partidaRef);
  }

  async adicionarMembroGrupo(nome: string, senha: string, admin: boolean = false): Promise<void> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const ref = doc(this.firestore, `grupos/${uidGrupo}/membros/${nome}`);
    await setDoc(ref, { senha, admin });
  }

  async removerPalpiteiro(nome: string): Promise<void> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const ref = doc(this.firestore, `grupos/${uidGrupo}/membros/${nome}`);
    await deleteDoc(ref);
  }

  async atualizarNomePalpiteiro(nomeAntigo: string, novoNome: string): Promise<void> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const membroRefAntigo = doc(this.firestore, `grupos/${uidGrupo}/membros/${nomeAntigo}`);
    const membroRefNovo = doc(this.firestore, `grupos/${uidGrupo}/membros/${novoNome}`);
    const docSnap = await getDoc(membroRefAntigo);

    if (!docSnap.exists()) throw new Error('Palpiteiro não encontrado.');

    const data = docSnap.data();
    await setDoc(membroRefNovo, data);
    await deleteDoc(membroRefAntigo);
  }

  async getPartidasNaoVerificadas(): Promise<any[]> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const partidasRef = collection(this.firestore, `grupos/${uidGrupo}/partidas`);
    const q = query(partidasRef, where('verificado', '==', false));
    const snapshot = await getDocs(q);

    const partidas: any[] = [];

    for (const docSnap of snapshot.docs) {
      const partida = docSnap.data();
      const palpitesRef = collection(this.firestore, `grupos/${uidGrupo}/partidas/${docSnap.id}/palpites`);
      const palpitesSnap = await getDocs(palpitesRef);
      const palpites = palpitesSnap.docs.map(p => ({ nome: p.id, ...p.data() }));

      partidas.push({
        id: docSnap.id,
        ...partida,
        palpites
      });
    }

    return partidas;
  }
}
