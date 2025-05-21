// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { getAuth, signOut } from 'firebase/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uid: string = '';
  nome: string = '';
  grupoId: string = '';
  isAdmin: boolean = false;

  constructor() {
    this.carregarSessao();
  }

  setUsuario(uid: string, nome: string, grupoId: string, admin: boolean) {
    this.uid = uid;
    this.nome = nome;
    this.grupoId = grupoId;
    this.isAdmin = admin;

    localStorage.setItem(
      'usuario',
      JSON.stringify({ uid, nome, grupoId, isAdmin: admin })
    );
  }

  carregarSessao() {
    const dados = localStorage.getItem('usuario');
    if (dados) {
      const user = JSON.parse(dados);
      this.uid = user.uid;
      this.nome = user.nome;
      this.grupoId = user.grupoId;
      this.isAdmin = user.isAdmin;
    }
  }

  logout() {
    signOut(getAuth());
    localStorage.clear();
  }

  estaLogado(): boolean {
    return !!this.uid && !!this.grupoId;
  }

  getUsuario(): string {
    return this.nome;
  }

  getGrupoId(): string {
    return this.grupoId;
  }

  isAdminUser(): boolean {
      return this.isAdmin === true;
  }

  getUid(): string {
    return this.uid;
  }
  async encontrarGrupoPorUid(uid: string, firestore: Firestore): Promise<string | null> {
  const gruposRef = doc(firestore, `grupos/lista`);
  const snapshot = await getDoc(gruposRef); // se tiver algum índice, substitua por consulta ideal
  // Aqui você deverá implementar uma maneira de localizar em qual grupo está o uid

  // Exemplo básico:
  // Iterar manualmente todos os grupos seria inviável em produção, aqui é apenas ilustração:
  return `grupo-algumaCoisa`; // substitua por lógica real
}

}
