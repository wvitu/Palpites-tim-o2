import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usuario: string = '';
  admin: boolean = false;
  grupoId: string = '';

  setUsuario(usuario: string, admin: boolean, grupoId: string) {
    this.usuario = usuario;
    this.admin = admin;
    this.grupoId = grupoId;
  }

  isAdmin(): boolean {
    return this.admin;
  }

  getGrupoId(): string {
    return this.grupoId;
  }

  getUsuario(): string {
    return this.usuario;
  }

  logout() {
    this.usuario = '';
    this.admin = false;
    this.grupoId = '';
  }
}
