import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableroService } from '../services/tablero.service';
import { Tablero, Columna, Tarjeta, Etiqueta, Prioridad } from '../models/tablero.model';
import { TarjetaDetalleComponent } from '../tarjeta-detalle/tarjeta-detalle.component';
import { EtiquetasManagerComponent } from '../../../shared/components/etiquetas-manager/etiquetas-manager.component';
import { EtiquetaService } from '../../../shared/services/etiqueta.service';
import { TarjetasArchivadasComponent } from '../../../shared/components/tarjetas-archivadas/tarjetas-archivadas.component';
import { TarjetaArchivadaService } from '../../../shared/services/tarjeta-archivada.service';

@Component({
  selector: 'app-tablero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    TarjetaDetalleComponent,
    EtiquetasManagerComponent,
    TarjetasArchivadasComponent
  ],
  templateUrl: './tablero.component.html',
  styleUrl: './tablero.component.scss'
})
export class TableroComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tableroService = inject(TableroService);
  private etiquetaService = inject(EtiquetaService);
  private archivadasService = inject(TarjetaArchivadaService);

  tablero: Tablero | undefined;
  tarjetaSeleccionada: Tarjeta | null = null;
  gestorEtiquetasAbierto: boolean = false;
  modalArchivadasAbierto: boolean = false;
  textoBusqueda: string = '';

  // Modales para Crear Columna y Crear Tarjeta
  modalCrearColumnaAbierto: boolean = false;
  nuevoNombreColumna: string = '';
  nuevoColorColumna: string = '#3498db';

  modalCrearTarjetaAbierto: boolean = false;
  columnaDestinoParaTarjeta: Columna | null = null;
  nuevoTituloTarjeta: string = '';
  nuevaDescTarjeta: string = '';
  nuevaDescDetalleTarjeta: string = '';
  nuevaPrioridadTarjeta: Prioridad = 'media';
  nuevasEtiquetasSeleccionadas: Etiqueta[] = [];

  paletaColores: string[] = [
    '#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#16a085',
    '#3498db', '#2980b9', '#8e44ad', '#2c3e50', '#e91e63'
  ];

  private wasDragged = false;

  get totalArchivadas(): number {
    if (!this.tablero) return 0;
    return this.archivadasService.getArchivadasPorTablero(this.tablero.id).length;
  }

  get todasLasEtiquetas(): Etiqueta[] {
    return this.etiquetaService.getEtiquetas();
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tablero = this.tableroService.getTableroById(id);
    }
    if (!this.tablero) {
      this.router.navigate(['/carroceria']);
    }
  }

  // ── Archivar Tarjeta con Check Redondo ────────────────────────────────────
  archivarTarjetaCheck(tarjeta: Tarjeta, columna: Columna, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.tablero) return;

    this.archivadasService.archivarTarjeta(tarjeta, this.tablero, columna);
    if (this.tarjetaSeleccionada?.id === tarjeta.id) {
      this.tarjetaSeleccionada = null;
    }
  }

  // ── Filtrado ─────────────────────────────────────────────────────────────
  getTarjetasFiltradas(columna: Columna): Tarjeta[] {
    const query = this.textoBusqueda.trim().toLowerCase();
    if (!query) {
      return columna.tarjetas;
    }

    return columna.tarjetas.filter(t => {
      const coincideEtiqueta = t.etiquetas.some(e => e.texto.toLowerCase().includes(query));
      const coincideTitulo = t.titulo.toLowerCase().includes(query);
      const coincideDesc = t.descripcion?.toLowerCase().includes(query);
      return coincideEtiqueta || coincideTitulo || coincideDesc;
    });
  }

  limpiarBusqueda(): void {
    this.textoBusqueda = '';
  }

  // ── Drag & Drop ──────────────────────────────────────────────────────────
  drop(event: CdkDragDrop<Tarjeta[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  onDragStarted(): void {
    this.wasDragged = true;
  }

  onDragEnded(): void {
    setTimeout(() => { this.wasDragged = false; }, 80);
  }

  // ── Gestión de Columnas ──────────────────────────────────────────────────
  abrirModalCrearColumna(): void {
    this.nuevoNombreColumna = '';
    this.nuevoColorColumna = '#3498db';
    this.modalCrearColumnaAbierto = true;
  }

  guardarNuevaColumna(): void {
    const nombre = this.nuevoNombreColumna.trim();
    if (!nombre || !this.tablero) return;

    const nuevaColumna: Columna = {
      id: `col-${Date.now()}`,
      nombre,
      color: this.nuevoColorColumna,
      tarjetas: []
    };

    this.tablero.columnas.push(nuevaColumna);
    this.modalCrearColumnaAbierto = false;
  }

  eliminarColumna(columna: Columna, event: MouseEvent): void {
    event.stopPropagation();
    if (!this.tablero) return;

    const tieneTarjetas = columna.tarjetas.length > 0;
    const confirmMsg = tieneTarjetas
      ? `La columna "${columna.nombre}" tiene ${columna.tarjetas.length} tarjetas. ¿Seguro que deseas eliminarla con todas sus tarjetas?`
      : `¿Eliminar la columna "${columna.nombre}"?`;

    if (confirm(confirmMsg)) {
      this.tablero.columnas = this.tablero.columnas.filter(c => c.id !== columna.id);
    }
  }

  // ── Gestión de Tarjetas ──────────────────────────────────────────────────
  abrirModalCrearTarjeta(columna: Columna): void {
    this.columnaDestinoParaTarjeta = columna;
    this.nuevoTituloTarjeta = '';
    this.nuevaDescTarjeta = '';
    this.nuevaDescDetalleTarjeta = '';
    this.nuevaPrioridadTarjeta = 'media';
    this.nuevasEtiquetasSeleccionadas = [];
    this.modalCrearTarjetaAbierto = true;
  }

  toggleEtiquetaNuevaTarjeta(etq: Etiqueta): void {
    const idx = this.nuevasEtiquetasSeleccionadas.findIndex(e => e.id === etq.id);
    if (idx !== -1) {
      this.nuevasEtiquetasSeleccionadas.splice(idx, 1);
    } else {
      this.nuevasEtiquetasSeleccionadas.push({ ...etq });
    }
  }

  guardarNuevaTarjeta(): void {
    const titulo = this.nuevoTituloTarjeta.trim();
    if (!titulo || !this.columnaDestinoParaTarjeta) return;

    const nuevaTarjeta: Tarjeta = {
      id: `t-${Date.now()}`,
      titulo,
      descripcion: this.nuevaDescTarjeta.trim(),
      descripcionDetalle: this.nuevaDescDetalleTarjeta.trim(),
      prioridad: this.nuevaPrioridadTarjeta,
      etiquetas: [...this.nuevasEtiquetasSeleccionadas],
      comentarios: [],
      fechaCreacion: new Date()
    };

    this.columnaDestinoParaTarjeta.tarjetas.unshift(nuevaTarjeta);
    this.modalCrearTarjetaAbierto = false;
  }

  eliminarTarjetaDirecta(tarjeta: Tarjeta, columna: Columna, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm(`¿Eliminar la tarjeta "${tarjeta.titulo}"?`)) {
      columna.tarjetas = columna.tarjetas.filter(t => t.id !== tarjeta.id);
      if (this.tarjetaSeleccionada?.id === tarjeta.id) {
        this.tarjetaSeleccionada = null;
      }
    }
  }

  onTarjetaEliminadaDesdeModal(tarjetaId: string): void {
    if (!this.tablero) return;
    for (const col of this.tablero.columnas) {
      col.tarjetas = col.tarjetas.filter(t => t.id !== tarjetaId);
    }
    this.tarjetaSeleccionada = null;
  }

  // ── Modal Detalle ────────────────────────────────────────────────────────
  abrirTarjeta(tarjeta: Tarjeta): void {
    if (this.wasDragged) return;
    this.tarjetaSeleccionada = tarjeta;
  }

  cerrarModal(): void {
    this.tarjetaSeleccionada = null;
  }

  volver(): void {
    this.router.navigate(['/carroceria']);
  }

  prioridadClass(prioridad: string): string {
    return { alta: 'prioridad--alta', media: 'prioridad--media', baja: 'prioridad--baja' }[prioridad] ?? '';
  }

  prioridadLabel(prioridad: string): string {
    return { alta: '↑ Alta', media: '→ Media', baja: '↓ Baja' }[prioridad] ?? prioridad;
  }
}
