import { Component, Input, Output, OnChanges, OnInit, SimpleChanges, EventEmitter } from '@angular/core';
import { PalpiteService } from 'src/app/services/palpite.service';

@Component({
  selector: 'app-palpites',
  templateUrl: './palpites.component.html',
  styleUrls: ['./palpites.component.css']
})
export class PalpitesComponent implements OnInit, OnChanges {
  @Input() palpitesPreCarregados: any = {};
  @Input() adversario: string = '';
  @Input() dataHora: string = '';
  @Input() local: string = '';
  @Input() palpiteiros: string[] = [];
  @Input() partidaId: string = '';
  @Output() palpitesChange = new EventEmitter<any>();

  palpites: any = {};
  mensagensErro: any = {};
  mensagensSucesso: any = {};
  salvando: { [nome: string]: boolean } = {};

  constructor(private palpiteService: PalpiteService) {}

  ngOnInit(): void {
    // Aplica palpites pré-carregados ao iniciar
    for (const nome of this.palpiteiros) {
      if (!this.palpites[nome]) {
        this.palpites[nome] = this.palpitesPreCarregados[nome] || {
          torcedor: { casa: '', visitante: '' },
          realista: { casa: '', visitante: '' }
        };
        this.mensagensErro[nome] = '';
        this.mensagensSucesso[nome] = '';
      }
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['palpiteiros'] && changes['palpiteiros'].currentValue) {
      for (const nome of this.palpiteiros) {
        if (!this.palpites[nome]) {
          this.palpites[nome] = this.palpitesPreCarregados[nome] || {
            torcedor: { casa: '', visitante: '' },
            realista: { casa: '', visitante: '' }
          };
          this.mensagensErro[nome] = '';
          this.mensagensSucesso[nome] = '';
        }
      }
    }
  }

  async salvarPalpites(nome: string) {
    const p = this.palpites[nome];
    if (
      p.torcedor.casa === '' || p.torcedor.visitante === '' ||
      p.realista.casa === '' || p.realista.visitante === ''
    ) {
      this.mensagensErro[nome] = 'Preencha todos os campos antes de salvar.';
      this.mensagensSucesso[nome] = '';
      return;
    }

    if (!this.partidaId) {
      this.partidaId = this.gerarIdPartida();
    }

    this.salvando[nome] = true;
    this.mensagensErro[nome] = '';
    this.mensagensSucesso[nome] = '';

    try {
      await this.palpiteService.salvarPalpite(this.partidaId, nome, p);
      this.mensagensSucesso[nome] = 'Palpites salvos com sucesso!';
      this.palpitesChange.emit(this.palpites);
    } catch (error) {
      console.error('Erro ao salvar palpite:', error);
      this.mensagensErro[nome] = 'Erro ao salvar palpite.';
    } finally {
      this.salvando[nome] = false;
    }
  }

  private gerarIdPartida(): string {
    if (!this.dataHora || !this.adversario) return Date.now().toString();
    return `${this.dataHora}-${this.adversario}`.replace(/[^a-zA-Z0-9]/g, '_');
  }
}
