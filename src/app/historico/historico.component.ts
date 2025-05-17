import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PalpiteService } from '../services/palpite.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  partidasConferidas: any[] = [];

  constructor(private palpiteService: PalpiteService, private router: Router) {}

  async ngOnInit() {
    console.log('Partidas conferidas:', this.partidasConferidas);

    const partidas = await this.palpiteService.getPartidasConferidas();
    this.partidasConferidas = partidas.sort((a, b) =>
      new Date(b.dataHora).getTime() - new Date(a.dataHora).getTime()
    );
  }

  editarPartida(partida: any) {
    this.router.navigate(['/'], {
      state: {
        partida: {
          id: partida.id,
          adversario: partida.adversario,
          dataHora: partida.dataHora,
          local: partida.local,
          palpites: partida.palpites
        }
      }
    });
  }

}
