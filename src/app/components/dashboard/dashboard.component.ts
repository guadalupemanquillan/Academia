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
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit(): void {
    // Verificar que el usuario esté autenticado
    if (isPlatformBrowser(this.platformId) && !this.authService.isLoggedIn()) {
      // El guard debería manejar esto, pero por seguridad adicional
      console.log('Usuario no autenticado, redirigiendo a login');
      this.router.navigate(['/login']);
    } else {
      console.log('Usuario autenticado, token presente');
    }
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.authService.logout();
    if (isPlatformBrowser(this.platformId)) {
      this.router.navigate(['/login']);
    }
  }
}
