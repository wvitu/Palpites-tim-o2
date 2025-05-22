import { Component, OnInit } from '@angular/core';
import { PalpiteService } from 'src/app/services/palpite.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  palpiteiros: string[] = [];
  usuarioAtual: string = '';
  novoPalpiteiro: string = '';
  senhaPalpiteiro: string = '';

  constructor(
    private palpiteService: PalpiteService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.usuarioAtual = this.authService.getUsuario();
    await this.carregarPalpiteiros();
  }

  async carregarPalpiteiros() {
    const membros = await this.palpiteService.getMembrosGrupo();
    this.palpiteiros = membros.map(m => m.nome);
  }

  async adicionarNovoPalpiteiro() {
    if (!this.novoPalpiteiro || !this.senhaPalpiteiro) return;
    await this.palpiteService.adicionarMembroGrupo(this.novoPalpiteiro, this.senhaPalpiteiro);
    this.novoPalpiteiro = '';
    this.senhaPalpiteiro = '';
    await this.carregarPalpiteiros();
  }

  async removerPalpiteiro(nome: string) {
    if (confirm(`Deseja remover o palpiteiro "${nome}"?`)) {
      await this.palpiteService.removerPalpiteiro(nome);
      await this.carregarPalpiteiros();
    }
  }

  async editarPalpiteiro(nome: string) {
    const novoNome = prompt(`Novo nome para o palpiteiro "${nome}"`, nome);
    if (novoNome && novoNome !== nome) {
      await this.palpiteService.atualizarNomePalpiteiro(nome, novoNome);
      await this.carregarPalpiteiros();
    }
  }
}
