import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { EmpresasComponent } from './components/empresas/empresas.component';
import { CategoriasComponent } from './components/categorias/categorias.component';
import { TestsComponent } from './components/tests/tests.component';
import { LogrosComponent } from './components/logros/logros.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    title: 'Dashboard',
    children: [
      { path: '', redirectTo: 'empresas', pathMatch: 'full' },
      { path: 'empresas', component: EmpresasComponent, canActivate: [RoleGuard], data: { roles: ['editor'] } },
      { path: 'categorias', component: CategoriasComponent, canActivate: [RoleGuard], data: { roles: ['editor'] } },
      { path: 'tests', component: TestsComponent, canActivate: [RoleGuard], data: { roles: ['editor'] } },
      { path: 'logros', component: LogrosComponent, canActivate: [RoleGuard], data: { roles: ['editor'] } },
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];




@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    scrollOffset: [0, 0]
  })],
  exports: [RouterModule]
})


export class AppRoutingModule { }
