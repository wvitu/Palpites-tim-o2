import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public auth: AuthService) {}

  isAdmin(): boolean {
    return this.auth.isAdminUser(); // precisa retornar true se o usuário for admin
  }

  estaLogado(): boolean {
    return this.auth.estaLogado();
  }
}
