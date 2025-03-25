import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  activeRoute: string = '';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe(() => {
      this.activeRoute = this.router.url; // Guarda la ruta actual
    });
  }

  navigateToChildrens(route?: string | null) {
    if (!route) {
      this.router.navigate([`/dashboard/`])
      return
    }
    this.router.navigate([`/dashboard/${route}`])
  }

  logOut() {
    this.authService.logOut()
  }

  isActive(route: string): boolean {
    if (route === this.activeRoute) return true

    return false
  }

}
