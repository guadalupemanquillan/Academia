import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmpresasComponent } from './components/empresas/empresas.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { TestsComponent } from './components/tests/tests.component';
import { LogrosComponent } from './components/logros/logros.component';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    DashboardComponent,
    EmpresasComponent,
    CategoriasComponent,
    TestsComponent,
    LogrosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [App]
})
export class AppModule { }
