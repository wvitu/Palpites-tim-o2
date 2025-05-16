import { Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  query,
  where
} from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class PalpiteService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  private getUidGrupoOrThrow(): string {
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');
    return uidGrupo;
  }

  async salvarPalpite(partidaId: string, nomePalpiteiro: string, palpite: any): Promise<void> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const ref = doc(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}/palpites/${nomePalpiteiro}`);
    await setDoc(ref, palpite, { merge: true });
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

  async getMembrosGrupo(): Promise<string[]> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const membrosRef = collection(this.firestore, `grupos/${uidGrupo}/membros`);
    const snapshot = await getDocs(membrosRef);

    return snapshot.docs.map(doc => doc.id);
  }

  async adicionarMembroGrupo(nome: string): Promise<void> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const ref = doc(this.firestore, `grupos/${uidGrupo}/membros/${nome}`);
    await setDoc(ref, { ativo: true });
  }

  async getRankingGrupo(): Promise<{ nome: string; pontos: number; acertos: number }[]> {
    const uidGrupo = this.getUidGrupoOrThrow();
    const rankingRef = collection(this.firestore, `grupos/${uidGrupo}/ranking`);
    const snapshot = await getDocs(rankingRef);

    return snapshot.docs.map(doc => {
      const data = doc.data() as any;
      return {
        nome: doc.id,
        pontos: data.pontos || 0,
        acertos: data.acertos || 0
      };
    });
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

      // Verificação básica para entender por que dados podem estar incompletos
      if (!partida) {
        console.warn(`Partida ${partidaId} sem dados.`);
        continue;
      }

      // Coleta de palpites
      const palpitesRef = collection(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}/palpites`);
      const palpitesSnap = await getDocs(palpitesRef);
      const palpites = palpitesSnap.docs.map(p => ({
        nome: p.id,
        ...p.data()
      }));

      partidas.push({
        id: partidaId,
        adversario: partida['adversario'] || 'Desconhecido',
        dataHora: partida['dataHora'] || null,
        local: partida['local'] || 'Local não informado',
        resultadoCasa: partida['resultadoCasa'] ?? null,
        resultadoVisitante: partida['resultadoVisitante'] ?? null,
        palpites
      });
    }

    return partidas;
  }
}
