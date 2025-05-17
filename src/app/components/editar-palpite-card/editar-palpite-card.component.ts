import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-editar-palpite-card',
  templateUrl: './editar-palpite-card.component.html',
  styleUrls: ['./editar-palpite-card.component.css']
})
export class EditarPalpiteCardComponent {
  @Input() partida: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() atualizar = new EventEmitter<void>();

  palpites: any = {};

  getPalpiteiros(): string[] {
    return this.partida?.palpites?.map((p: any) => p.nome) || [];
  }

  mapearPalpites(): any {
    const map: any = {};
    for (const p of this.partida?.palpites || []) {
      map[p.nome] = {
        torcedor: p.torcedor,
        realista: p.realista
      };
    }
    return map;
  }

  onPalpitesAtualizados(palpites: any) {
    this.palpites = palpites;
  }

  onPontuacoesAtualizadas(event: any) {
    // Refresh no histórico, se necessário
    this.atualizar.emit();
  }

  fecharCard() {
    this.fechar.emit();
  }
}
