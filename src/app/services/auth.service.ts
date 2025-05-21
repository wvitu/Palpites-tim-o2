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
      JSON.stringify({ uid, nome, grupoId, admin }) // ✅ salva como 'admin' para padronizar
    );
  }

  carregarSessao() {
    const dados = localStorage.getItem('usuario');
    if (dados) {
      const user = JSON.parse(dados);
      console.log('🧠 Dados carregados da sessão:', user); // 👈 debug
      this.uid = user.uid;
      this.nome = user.nome;
      this.grupoId = user.grupoId;
      this.isAdmin = user.admin === true || user.admin === 'true';
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
    return this.isAdmin;
  }

  getUid(): string {
    return this.uid;
  }

  async encontrarGrupoPorUid(uid: string, firestore: Firestore): Promise<string | null> {
    const gruposRef = doc(firestore, `grupos/lista`);
    const snapshot = await getDoc(gruposRef);

    // Implementação real depende da estrutura do Firestore
    return `grupo-algumaCoisa`; // substitua com lógica real
  }
}
