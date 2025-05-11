import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-palpites',
  templateUrl: './palpites.component.html',
  styleUrls: ['./palpites.component.css']
})
export class PalpitesComponent {
  @Input() adversario: string = 'Adversário';
  @Input() dataHora: string = '';
  @Input() local: string = '';

  palpites = {
    vitor: {
      torcedor: { casa: '', visitante: '' },
      realista: { casa: '', visitante: '' }
    },
    matheus: {
      torcedor: { casa: '', visitante: '' },
      realista: { casa: '', visitante: '' }
    }
  };

  mensagensErro: { [key: string]: string } = {
    vitor: '',
    matheus: ''
  };

  mensagensSucesso: { [key: string]: string } = {
    vitor: '',
    matheus: ''
  };

  salvarPalpites(usuario: 'vitor' | 'matheus', tipo: 'torcedor' | 'realista', casa: string, visitante: string) {
    if (casa === '' || visitante === '') {
      this.mensagensErro[usuario] = `Preencha todos os campos do palpite ${tipo}`;
      this.mensagensSucesso[usuario] = '';
      return;
    }

    this.palpites[usuario][tipo] = { casa, visitante };
    this.mensagensErro[usuario] = '';

    // Verifica se ambos os palpites foram preenchidos corretamente
    const p = this.palpites[usuario];
    if (p.torcedor.casa !== '' && p.torcedor.visitante !== '' &&
        p.realista.casa !== '' && p.realista.visitante !== '') {
      this.mensagensSucesso[usuario] = 'Palpites salvos com sucesso!';
    }
  }
}
