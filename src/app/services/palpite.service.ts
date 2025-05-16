import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { collection, getDocs, addDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class PalpiteService {
  constructor(private firestore: Firestore, private auth: AuthService) {}

  async salvarPalpite(partidaId: string, nomePalpiteiro: string, palpite: any) {
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) {
      throw new Error('Grupo não autenticado.');
    }

    const ref = doc(this.firestore, `grupos/${uidGrupo}/partidas/${partidaId}/palpites/${nomePalpiteiro}`);
    await setDoc(ref, palpite, { merge: true });
  }

  async atualizarRanking(nome: string, pontos: number) {
    const uidGrupo = this.auth.getUidGrupo();
    if (!uidGrupo) throw new Error('Grupo não autenticado.');

    const ref = doc(this.firestore, `grupos/${uidGrupo}/ranking/${nome}`);
    const docSnap = await getDoc(ref);

    let dados = { pontos: 0, acertos: 0 };
    if (docSnap.exists()) {
      dados = docSnap.data() as any;
    }

    dados.pontos += pontos;
    dados.acertos += 1;

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

async getRankingGrupo(): Promise<{ nome: string, pontos: number, acertos: number }[]> {
  const uidGrupo = this.auth.getUidGrupo();
  if (!uidGrupo) throw new Error('Grupo não autenticado.');

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

}
