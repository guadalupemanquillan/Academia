import { Component } from '@angular/core';
import { TestService } from '../../core/services/test.service';
import { TestItem } from '../../core/models/test.model';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  standalone: false
})
export class TestsComponent {
  tests: TestItem[] = [];
  nuevoTest: TestItem = { preguntas: [{ tituloPregunta: '', opcionesRespuesta: ['', ''], respuestaCorrecta: '' }], logros: [] };
  testEditar: Partial<TestItem> | null = null;
  testEliminarId: string | null = null;

  constructor(private testService: TestService) {
    this.cargarTests();
  }

  cargarTests(): void {
    this.testService.getAll().subscribe({
      next: t => { this.tests = t; },
      error: () => { }
    });
  }

  agregarOpcion(indexPregunta: number): void {
    this.nuevoTest.preguntas[indexPregunta].opcionesRespuesta.push('');
  }

  crearTest(): void {
    const payload: TestItem = {
      preguntas: this.nuevoTest.preguntas.map(p => ({
        tituloPregunta: p.tituloPregunta,
        opcionesRespuesta: p.opcionesRespuesta.filter(o => !!o?.trim()),
        respuestaCorrecta: p.respuestaCorrecta
      })),
      logros: this.nuevoTest.logros
    };
    this.testService.create(payload).subscribe(() => {
      this.nuevoTest = { preguntas: [{ tituloPregunta: '', opcionesRespuesta: ['', ''], respuestaCorrecta: '' }], logros: [] };
      this.cargarTests();
      (document.getElementById('crearTestCerrarBtn') as HTMLButtonElement)?.click();
    });
  }

  abrirEditarTest(t: TestItem): void {
    this.testService.getOne(t._id as string).subscribe(res => {
      this.testEditar = { ...res };
    });
  }

  guardarEdicionTest(): void {
    if (!this.testEditar || !this.testEditar._id) return;
    const { _id, ...rest } = this.testEditar as TestItem;
    this.testService.update(_id!, rest).subscribe(() => {
      (document.getElementById('editarTestCerrarBtn') as HTMLButtonElement)?.click();
      this.cargarTests();
    });
  }

  confirmarEliminarTest(t: TestItem): void {
    this.testEliminarId = t._id || null;
  }

  eliminarTest(): void {
    if (!this.testEliminarId) return;
    this.testService.delete(this.testEliminarId).subscribe(() => {
      (document.getElementById('eliminarTestCerrarBtn') as HTMLButtonElement)?.click();
      this.testEliminarId = null;
      this.cargarTests();
    });
  }
}

