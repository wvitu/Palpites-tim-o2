import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PalpiteService } from 'src/app/services/palpite.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  partidasConferidas: any[] = [];

  constructor(private palpiteService: PalpiteService, private router: Router) {}

  async ngOnInit(): Promise<void> {
    this.partidasConferidas = await this.palpiteService.getPartidasConferidas();

    // Ordenar da mais recente para mais antiga
    this.partidasConferidas.sort((a, b) => {
      const dataA = new Date(a.dataHora);
      const dataB = new Date(b.dataHora);
      return dataB.getTime() - dataA.getTime();
    });
  }

  editarPalpite(partida: any) {
    this.router.navigate(['/'], { state: { partida } });
  }
}
