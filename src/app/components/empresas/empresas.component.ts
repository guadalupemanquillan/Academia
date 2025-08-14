import { Component } from '@angular/core';
import { EmpresaService } from '../../core/services/empresa.service';
import { Empresa } from '../../core/models/empresa.model';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  standalone: false
})
export class EmpresasComponent {
  empresas: Empresa[] = [];
  empresasFiltro = '';
  nuevaEmpresa: Empresa = { nombre: '', imagen: '' };
  empresaSeleccionada: Empresa | null = null;
  empresaEditar: Empresa | null = null;
  empresaEliminarId: string | null = null;

  constructor(private empresaService: EmpresaService) {
    this.cargarEmpresas();
  }

  cargarEmpresas(): void {
    this.empresaService.getAll().subscribe({
      next: empresas => { this.empresas = empresas; },
      error: () => {}
    });
  }

  get empresasFiltradas(): Empresa[] {
    const q = this.empresasFiltro.trim().toLowerCase();
    if (!q) return this.empresas;
    return this.empresas.filter(e => e.nombre.toLowerCase().includes(q));
  }

  crearEmpresa(): void {
    if (!this.nuevaEmpresa.nombre || !this.nuevaEmpresa.imagen) return;
    this.empresaService.create(this.nuevaEmpresa).subscribe(() => {
      this.nuevaEmpresa = { nombre: '', imagen: '' };
      this.cargarEmpresas();
      (document.getElementById('crearEmpresaCerrarBtn') as HTMLButtonElement)?.click();
    });
  }

  verEmpresa(empresa: Empresa): void {
    this.empresaService.getOne(empresa._id as string).subscribe(e => {
      this.empresaSeleccionada = e;
    });
  }

  abrirEditarEmpresa(empresa: Empresa): void {
    this.empresaService.getOne(empresa._id as string).subscribe(e => {
      this.empresaEditar = { ...e };
    });
  }

  guardarEdicionEmpresa(): void {
    if (!this.empresaEditar || !this.empresaEditar._id) return;
    const { _id, ...rest } = this.empresaEditar as Empresa;
    this.empresaService.update(_id!, rest).subscribe(() => {
      (document.getElementById('editarEmpresaCerrarBtn') as HTMLButtonElement)?.click();
      this.cargarEmpresas();
    });
  }

  confirmarEliminarEmpresa(empresa: Empresa): void {
    this.empresaEliminarId = empresa._id || null;
  }

  eliminarEmpresa(): void {
    if (!this.empresaEliminarId) return;
    this.empresaService.delete(this.empresaEliminarId).subscribe(() => {
      (document.getElementById('eliminarEmpresaCerrarBtn') as HTMLButtonElement)?.click();
      this.empresaEliminarId = null;
      this.cargarEmpresas();
    });
  }
}

