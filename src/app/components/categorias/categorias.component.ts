import { Component } from '@angular/core';
import { CategoriaService } from '../../core/services/categoria.service';
import { Categoria, CategoriaPaginatedResponse } from '../../core/models/categoria.model';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  standalone: false
})
export class CategoriasComponent {
  categoriasResp?: CategoriaPaginatedResponse;
  categoriasNombreFiltro = '';
  categoriasPage = 1;
  categoriasLimit = 10;
  nuevaCategoria: Partial<Categoria> = { nombre: '', categoriaPadre: null, jerarquia: 0 };
  categoriaEditar: Partial<Categoria> | null = null;
  categoriaEliminarId: string | null = null;

  constructor(private categoriaService: CategoriaService) {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.getAll(this.categoriasPage, this.categoriasLimit, this.categoriasNombreFiltro).subscribe({
      next: resp => { this.categoriasResp = resp; },
      error: () => { }
    });
  }

  cambiarPaginaCategorias(page: number): void {
    if (page < 1 || (this.categoriasResp && page > this.categoriasResp.totalPages)) return;
    this.categoriasPage = page;
    this.cargarCategorias();
  }

  crearCategoria(): void {
    if (!this.nuevaCategoria.nombre) return;
    this.categoriaService.create(this.nuevaCategoria).subscribe(() => {
      this.nuevaCategoria = { nombre: '', categoriaPadre: null, jerarquia: 0 };
      this.cargarCategorias();
      (document.getElementById('crearCategoriaCerrarBtn') as HTMLButtonElement)?.click();
    });
  }

  categoriaNombrePorId(id?: string | null): string {
    if (!id || !this.categoriasResp?.items) return '-';
    const found = this.categoriasResp.items.find(c => (c as any)._id === id);
    return found?.nombre || '-';
  }

  abrirEditarCategoria(cat: Categoria): void {
    this.categoriaService.getOne(cat._id as string).subscribe(c => {
      this.categoriaEditar = { ...c };
    });
  }

  guardarEdicionCategoria(): void {
    if (!this.categoriaEditar || !this.categoriaEditar._id) return;
    const { _id, ...rest } = this.categoriaEditar as Categoria;
    this.categoriaService.update(_id!, rest).subscribe(() => {
      (document.getElementById('editarCategoriaCerrarBtn') as HTMLButtonElement)?.click();
      this.cargarCategorias();
    });
  }

  confirmarEliminarCategoria(cat: Categoria): void {
    this.categoriaEliminarId = cat._id || null;
  }

  eliminarCategoria(): void {
    if (!this.categoriaEliminarId) return;
    this.categoriaService.delete(this.categoriaEliminarId).subscribe(() => {
      (document.getElementById('eliminarCategoriaCerrarBtn') as HTMLButtonElement)?.click();
      this.categoriaEliminarId = null;
      this.cargarCategorias();
    });
  }
}

