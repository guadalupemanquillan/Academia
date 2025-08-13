import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // Durante desarrollo, permitir acceso temporalmente
    // TODO: Restaurar la verificación de autenticación cuando la API esté lista
    console.log('AuthGuard: Verificando acceso...');
    console.log('AuthGuard: isLoggedIn =', this.authService.isLoggedIn());
    
    if (this.authService.isLoggedIn()) {
      console.log('AuthGuard: Usuario autenticado, permitiendo acceso');
      return true;
    } else {
      console.log('AuthGuard: Usuario no autenticado, pero permitiendo acceso durante desarrollo');
      // Temporalmente permitir acceso durante desarrollo
      return true;
      
      // Código original (comentado temporalmente):
      // if (isPlatformBrowser(this.platformId)) {
      //   this.router.navigate(['/login']);
      // }
      // return false;
    }
  }
}
