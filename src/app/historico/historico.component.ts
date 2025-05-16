import { Component, OnInit } from '@angular/core';
import { PalpiteService } from '../services/palpite.service';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html',
  styleUrls: ['./historico.component.css']
})
export class HistoricoComponent implements OnInit {
  partidasConferidas: any[] = [];

  constructor(private palpiteService: PalpiteService) {}

  ngOnInit(): void {
    this.palpiteService.getPartidasConferidas().then(partidas => {
      this.partidasConferidas = partidas;
    });
  }
}
