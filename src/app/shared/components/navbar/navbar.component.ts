import { Component } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private authService:AuthService){}

  logOut(){
    this.authService.logOut()
  }
}
