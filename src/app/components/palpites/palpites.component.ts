import { Component, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-palpites',
  templateUrl: './palpites.component.html',
  styleUrls: ['./palpites.component.css']
})
export class PalpitesComponent implements OnChanges {
  @Input() adversario: string = '';
  @Input() dataHora: string = '';
  @Input() local: string = '';
  @Input() palpiteiros: string[] = [];
  @Output() palpitesChange = new EventEmitter<any>();

  palpites: any = {};
  mensagensErro: any = {};
  mensagensSucesso: any = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['palpiteiros']?.currentValue) {
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
    this.palpitesChange.emit(this.palpites);
  }

  salvarPalpites(nome: string) {
    const p = this.palpites[nome];
    const tc = Number(p.torcedor.casa);
    const tv = Number(p.torcedor.visitante);
    const rc = Number(p.realista.casa);
    const rv = Number(p.realista.visitante);

    if (
      isNaN(tc) || isNaN(tv) ||
      isNaN(rc) || isNaN(rv)
    ) {
      this.mensagensErro[nome] = 'Preencha todos os campos antes de salvar.';
      this.mensagensSucesso[nome] = '';
      return;
    }

    this.mensagensErro[nome] = '';
    this.mensagensSucesso[nome] = 'Palpites salvos com sucesso!';
    this.palpitesChange.emit(this.palpites);
  }
}
