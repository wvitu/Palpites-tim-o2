import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { PalpiteService } from 'src/app/services/palpite.service';

@Component({
  selector: 'app-palpites',
  templateUrl: './palpites.component.html',
  styleUrls: ['./palpites.component.css']
})
export class PalpitesComponent implements OnChanges {
  @Input() adversario: string = 'Adversário';
  @Input() dataHora: string = '';
  @Input() local: string = '';
  @Input() palpiteiros: string[] = [];
  @Output() palpitesChange = new EventEmitter<any>();

  palpites: any = {};
  mensagensErro: any = {};
  mensagensSucesso: any = {};

  constructor(private palpiteService: PalpiteService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['palpiteiros'] && changes['palpiteiros'].currentValue) {
      for (const nome of this.palpiteiros) {
        if (!this.palpites[nome]) {
          this.palpites[nome] = {
            torcedor: { casa: '', visitante: '' },
            realista: { casa: '', visitante: '' }
          };
          this.mensagensErro[nome] = '';
          this.mensagensSucesso[nome] = '';
        }
      }
    }
  }

  async salvarPalpites(nome: string) {
    const p = this.palpites[nome];
    if (
      p.torcedor.casa === '' || p.torcedor.visitante === '' ||
      p.realista.casa === '' || p.realista.visitante === ''
    ) {
      this.mensagensErro[nome] = 'Preencha todos os campos antes de salvar.';
      this.mensagensSucesso[nome] = '';
      return;
    }

    this.mensagensErro[nome] = '';
    this.mensagensSucesso[nome] = 'Palpites salvos com sucesso!';
    this.palpitesChange.emit(this.palpites);

    const partidaId = this.gerarIdPartida();
    await this.palpiteService.salvarPalpite(partidaId, nome, p);
  }

  private gerarIdPartida(): string {
    const data = new Date();
    return `${data.getFullYear()}-${data.getMonth()+1}-${data.getDate()}_${this.adversario}`;
  }
}
