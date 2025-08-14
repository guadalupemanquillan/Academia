import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  standalone: false
})
export class DashboardComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
  }
 
  logout(): void {
    console.log('Cerrando sesión...');
    this.authService.logout();
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/login']);
    }
  }
   cerrarSesion(): void {
    this.authService.logout();
  }
}
