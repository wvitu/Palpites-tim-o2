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

  salvarPalpites(usuario: 'vitor' | 'matheus', tipo: 'torcedor' | 'realista', casa: string, visitante: string) {
    if (casa === '' || visitante === '') {
      alert(`Preencha todos os campos do palpite ${tipo} de ${usuario.charAt(0).toUpperCase() + usuario.slice(1)}`);
      return;
    }

    this.palpites[usuario][tipo] = {
      casa,
      visitante
    };
  }
}
