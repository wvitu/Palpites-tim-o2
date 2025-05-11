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

  palpites: any = {};
  mensagensErro: any = {};
  mensagensSucesso: any = {};

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

  salvarPalpites(usuario: string, tipo: 'torcedor' | 'realista', casa: string, visitante: string) {
    if (casa === '' || visitante === '') {
      this.mensagensErro[usuario] = `Preencha todos os campos do palpite ${tipo}`;
      this.mensagensSucesso[usuario] = '';
      return;
    }

    this.palpites[usuario][tipo] = { casa, visitante };
    this.mensagensErro[usuario] = '';

    const p = this.palpites[usuario];
    if (p.torcedor.casa && p.torcedor.visitante && p.realista.casa && p.realista.visitante) {
      this.mensagensSucesso[usuario] = 'Palpites salvos com sucesso!';
    }
  }
}
