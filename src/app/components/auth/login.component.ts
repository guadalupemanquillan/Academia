import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: false
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    console.log('Intentando login con:', { username, password });

    this.authService.login(username, password).subscribe({
      next: (response) => {
        if (isPlatformBrowser(this.platformId)) {
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error de login:', err);
        this.loading = false;

        if (err.status === 0) {
          this.errorMessage = 'Error de conexión. Verifica que la API esté ejecutándose en el puerto 8080.';
        } else if (err.status === 400) {
          this.errorMessage = err.error?.error || 'Credenciales incorrectas';
        } else {
          this.errorMessage = 'Error inesperado. Intenta nuevamente.';
        }
      }
    });
  }
}






