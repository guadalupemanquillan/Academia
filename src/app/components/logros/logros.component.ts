import { Component, OnInit } from '@angular/core';
import { LogrosService } from '../../core/services/logros.service';
import { Logro } from '../../core/models/logros.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-logros',
  templateUrl: './logros.component.html',
  standalone: false
})
export class LogrosComponent implements OnInit {
  logros: Logro[] = [];
  nuevoLogro: Logro = { nombre: '', iconoUrl: '' } as Logro;
  logroEditar: Partial<Logro> | null = null;
  logroEliminarId: string | null = null;

  constructor(private logrosService: LogrosService, private authService: AuthService) {}

  ngOnInit(): void {
    this.cargarLogros();
  }

  cargarLogros(): void {
    this.logrosService.getAll().subscribe({
      next: l => { this.logros = l; },
      error: () => {}
    });
  }

  crearLogro(): void {
    const userId = this.authService.id;
    if (!userId || !this.nuevoLogro.nombre || !this.nuevoLogro.iconoUrl) return;
    this.logrosService.create({ userId, nombre: this.nuevoLogro.nombre, iconoUrl: this.nuevoLogro.iconoUrl }).subscribe(() => {
      this.nuevoLogro = { nombre: '', iconoUrl: '' } as Logro;
      this.cargarLogros();
      (document.getElementById('crearLogroCerrarBtn') as HTMLButtonElement)?.click();
    });
  }

  abrirEditarLogro(lg: Logro): void {
    this.logrosService.getOne(lg._id as string).subscribe(x => {
      this.logroEditar = { ...x };
    });
  }

  guardarEdicionLogro(): void {
    if (!this.logroEditar || !this.logroEditar._id) return;
    const { _id, ...rest } = this.logroEditar as Logro;
    this.logrosService.update(_id!, rest).subscribe(() => {
      (document.getElementById('editarLogroCerrarBtn') as HTMLButtonElement)?.click();
      this.cargarLogros();
    });
  }

  confirmarEliminarLogro(lg: Logro): void {
    this.logroEliminarId = lg._id || null;
  }

  eliminarLogro(): void {
    if (!this.logroEliminarId) return;
    this.logrosService.delete(this.logroEliminarId).subscribe({
      next: () => {
        (document.getElementById('eliminarLogroCerrarBtn') as HTMLButtonElement)?.click();
        this.logroEliminarId = null;
        this.cargarLogros();
        alert('Logro eliminado con éxito');
      },
      error: () => {
        alert('Ocurrió un error al eliminar el logro');
      }
    });
  }
}

