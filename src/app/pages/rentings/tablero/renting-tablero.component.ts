import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RentingTableroService } from '../services/renting-tablero.service';
import { Tablero, Columna, Tarjeta, Etiqueta, Prioridad } from '../../carroceria/models/tablero.model';
import { TarjetaDetalleComponent } from '../../carroceria/tarjeta-detalle/tarjeta-detalle.component';
import { EtiquetasManagerComponent } from '../../../shared/components/etiquetas-manager/etiquetas-manager.component';
import { EtiquetaService } from '../../../shared/services/etiqueta.service';
import { TarjetasArchivadasComponent } from '../../../shared/components/tarjetas-archivadas/tarjetas-archivadas.component';
import { TarjetaArchivadaService } from '../../../shared/services/tarjeta-archivada.service';

@Component({
  selector: 'app-renting-tablero',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    TarjetaDetalleComponent,
    EtiquetasManagerComponent,
    TarjetasArchivadasComponent
  ],
  templateUrl: './renting-tablero.component.html',
  styleUrl: './renting-tablero.component.scss'
})
export class RentingTableroComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private rentingService = inject(RentingTableroService);
  private etiquetaService = inject(EtiquetaService);
  private archivadasService = inject(TarjetaArchivadaService);

  tablero: Tablero | undefined;
  tarjetaSeleccionada: Tarjeta | null = null;
  gestorEtiquetasAbierto: boolean = false;
  modalArchivadasAbierto: boolean = false;
  textoBusqueda: string = '';

  modalCrearColumnaAbierto: boolean = false;
  nuevoNombreColumna: string = '';
  nuevoColorColumna: string = '#0284c7';

  modalCrearTarjetaAbierto: boolean = false;
  columnaDestinoParaTarjeta: Columna | null = null;
  nuevoTituloTarjeta: string = '';
  nuevaDescTarjeta: string = '';
  nuevaDescDetalleTarjeta: string = '';
  nuevaPrioridadTarjeta: Prioridad = 'media';
  nuevasEtiquetasSeleccionadas: Etiqueta[] = [];

  paletaColores: string[] = [
    '#0284c7', '#059669', '#7c3aed', '#be185d', '#e67e22',
    '#f59e0b', '#3b82f6', '#10b981', '#64748b', '#ef4444'
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
      this.tablero = this.rentingService.getTableroById(id);
    }
    if (!this.tablero) {
      this.router.navigate(['/rentings']);
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

  abrirModalCrearColumna(): void {
    this.nuevoNombreColumna = '';
    this.nuevoColorColumna = '#0284c7';
    this.modalCrearColumnaAbierto = true;
  }

  guardarNuevaColumna(): void {
    const nombre = this.nuevoNombreColumna.trim();
    if (!nombre || !this.tablero) return;

    const nuevaColumna: Columna = {
      id: `rcol-${Date.now()}`,
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
      ? `La columna "${columna.nombre}" contiene ${columna.tarjetas.length} tarjetas. ¿Seguro que deseas eliminarla junto con todas sus tarjetas?`
      : `¿Eliminar la columna "${columna.nombre}"?`;

    if (confirm(confirmMsg)) {
      this.tablero.columnas = this.tablero.columnas.filter(c => c.id !== columna.id);
    }
  }

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
      id: `rt-${Date.now()}`,
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

  abrirTarjeta(tarjeta: Tarjeta): void {
    if (this.wasDragged) return;
    this.tarjetaSeleccionada = tarjeta;
  }

  cerrarModal(): void {
    this.tarjetaSeleccionada = null;
  }

  volver(): void {
    this.router.navigate(['/rentings']);
  }

  prioridadClass(prioridad: string): string {
    return { alta: 'prioridad--alta', media: 'prioridad--media', baja: 'prioridad--baja' }[prioridad] ?? '';
  }

  prioridadLabel(prioridad: string): string {
    return { alta: '↑ Alta', media: '→ Media', baja: '↓ Baja' }[prioridad] ?? prioridad;
  }
}
