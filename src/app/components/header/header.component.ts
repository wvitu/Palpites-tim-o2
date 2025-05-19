import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(public auth: AuthService) {}

  ngOnInit(): void {
    this.isAdmin = this.auth.isAdminUser();
  }
}
