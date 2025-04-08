import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from "../navbar/navbar.component";
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [NavbarComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class SidebarComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) { }

  navigateToChildrens(route: string) {
    this.router.navigate([`/dashboard/${route}`])
  }

  logOut(){
    this.authService.logOut()
  }
}
