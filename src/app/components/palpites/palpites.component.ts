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

  // Estrutura para armazenar os palpites salvos
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

  // Método que salva os palpites
  salvarPalpites(usuario: 'vitor' | 'matheus', tipo: 'torcedor' | 'realista', casa: string, visitante: string) {
    this.palpites[usuario][tipo] = {
      casa,
      visitante
    };
  }
}
