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
}
