import { Component, OnInit } from '@angular/core';
import { PalpiteService } from 'src/app/services/palpite.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  nome: string = '';
  senha: string = '';
  membros: { nome: string, admin: boolean }[] = [];
  erro: string = '';
  sucesso: string = '';

  constructor(
    private palpiteService: PalpiteService,
    private auth: AuthService
  ) {}

  async ngOnInit() {
    if (!this.auth.isAdmin()) {
      this.erro = 'Acesso restrito. Somente administradores.';
      return;
    }
    await this.carregarMembros();
  }

  async adicionarMembro() {
    this.erro = '';
    this.sucesso = '';

    if (!this.nome || !this.senha) {
      this.erro = 'Preencha nome e senha.';
      return;
    }

    try {
      await this.palpiteService.adicionarMembroGrupo(this.nome, this.senha);
      this.sucesso = `Membro ${this.nome} adicionado com sucesso!`;
      this.nome = '';
      this.senha = '';
      await this.carregarMembros();
    } catch (e) {
      console.error(e);
      this.erro = 'Erro ao adicionar membro.';
    }
  }

  async carregarMembros() {
    this.membros = await this.palpiteService.getMembrosGrupo();
  }
}
