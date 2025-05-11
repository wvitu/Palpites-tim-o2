import { Component, Input, OnChanges } from '@angular/core';

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

  palpites: Record<string, {
    torcedor: { casa: string; visitante: string };
    realista: { casa: string; visitante: string };
  }> = {};

  mensagensErro: Record<string, string> = {};
  mensagensSucesso: Record<string, string> = {};

  trackByNome(index: number, item: string): string {
    return item;
  }


  ngOnChanges(): void {
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

  salvarPalpites(nome: string) {
    const p = this.palpites[nome];
    if (
      p.torcedor.casa === '' || p.torcedor.visitante === '' ||
      p.realista.casa === '' || p.realista.visitante === ''
    ) {
      this.mensagensErro[nome] = 'Preencha todos os campos dos palpites.';
      this.mensagensSucesso[nome] = '';
      return;
    }

    this.mensagensErro[nome] = '';
    this.mensagensSucesso[nome] = 'Palpites salvos com sucesso!';
  }
}
