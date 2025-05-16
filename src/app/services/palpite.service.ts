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

  async salvarPalpite(partidaId: string, nomePalpiteiro: string, palpite: any) {
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');

    const ref = doc(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}/palpites/${nomePalpiteiro}`);
    await setDoc(ref, palpite, { merge: true });
  }

  async atualizarRanking(nome: string, pontos: number, acertos: number) {
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');

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
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');

    const membrosRef = collection(this.firestore, `grupos/${uidGrupo}/membros`);
    const snapshot = await getDocs(membrosRef);

    return snapshot.docs.map(doc => doc.id);
  }

  async adicionarMembroGrupo(nome: string): Promise<void> {
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');

    const ref = doc(this.firestore, `grupos/${uidGrupo}/membros/${nome}`);
    await setDoc(ref, { ativo: true });
  }

  async getRankingGrupo(): Promise<{ nome: string; pontos: number; acertos: number }[]> {
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');

    const rankingRef = collection(this.firestore, `grupos/${uidGrupo}/ranking`);
    const snapshot = await getDocs(rankingRef);

    return snapshot.docs.map(doc => ({
      nome: doc.id,
      ...(doc.data() as { pontos: number; acertos: number })
    }));
  }

  async getPartidasConferidas(): Promise<any[]> {
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');

    const partidasRef = collection(this.firestore, `grupos/${uidGrupo}/partidas`);
    const q = query(partidasRef, where('verificado', '==', true));
    const snapshot = await getDocs(q);

    const partidas: any[] = [];
    for (const docSnap of snapshot.docs) {
      const partida = docSnap.data();
      const palpitesRef = collection(this.firestore, `grupos/${uidGrupo}/partidas/${docSnap.id}/palpites`);
      const palpitesSnap = await getDocs(palpitesRef);
      const palpites = palpitesSnap.docs.map(p => ({ nome: p.id, ...p.data() }));
      partidas.push({ ...partida, palpites });
    }

    return partidas;
  }
}
