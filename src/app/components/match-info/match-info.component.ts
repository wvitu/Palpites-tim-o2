import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-match-info',
  templateUrl: './match-info.component.html',
  styleUrls: ['./match-info.component.css']
})
export class MatchInfoComponent {
  adversario: string = '';
  dataHora: string = '';
  local: string = 'Neo Química Arena';
  novoPalpiteiro: string = '';

  @Output() jogoAtualizado = new EventEmitter<{ adversario: string; dataHora: string; local: string }>();
  @Output() adicionarPalpiteiro = new EventEmitter<string>();

  constructor() {
    const hoje = new Date();
    hoje.setHours(18);
    hoje.setMinutes(30);
    this.dataHora = hoje.toISOString().substring(0, 16);
  }

  atualizarInformacoes() {
    if (!this.adversario.trim()) {
      alert('Informe o nome do adversário.');
      return;
    }

    if (!this.dataHora) {
      alert('Informe a data e hora.');
      return;
    }

    if (this.local.trim().length < 5) {
      alert('O local deve ter no mínimo 5 caracteres.');
      return;
    }

    this.jogoAtualizado.emit({
      adversario: this.adversario,
      dataHora: this.dataHora,
      local: this.local
    });
  }

  emitirPalpiteiro() {
    const nome = this.novoPalpiteiro.trim();
    if (nome.length > 0) {
      this.adicionarPalpiteiro.emit(nome);
      this.novoPalpiteiro = '';
    }
  }
}

