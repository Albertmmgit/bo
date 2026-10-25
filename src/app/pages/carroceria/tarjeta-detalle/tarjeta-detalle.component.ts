import { Component, Input, Output, EventEmitter, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Tarjeta, Comentario, Etiqueta, TipoIncidencia } from '../models/tablero.model';
import { EtiquetaService } from '../../../shared/services/etiqueta.service';

@Component({
  selector: 'app-tarjeta-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarjeta-detalle.component.html',
  styleUrl: './tarjeta-detalle.component.scss'
})
export class TarjetaDetalleComponent implements OnInit {
  private etiquetaService = inject(EtiquetaService);

  @Input() tarjeta!: Tarjeta;
  @Input() tableroColor = '#1a73e8';
  @Output() cerrar = new EventEmitter<void>();
  @Output() eliminar = new EventEmitter<string>();

  nuevoComentario = '';
  selectorEtiquetasAbierto = false;
  editandoDescripcion: boolean = false;
  descripcionDetalleBorrador: string = '';

  readonly currentUser = { nombre: 'Alberto Martínez', iniciales: 'AM', color: '#1a73e8' };

  incidenciasDisponibles: TipoIncidencia[] = [
    'Sin incidencia',
    'Retraso de recambios',
    'Pintura defectuosa / Repintar',
    'Fallo mecánico imprevisto',
    'Documentación incompleta',
    'Discrepancia peritaje',
    'Problema de transporte / Logística'
  ];

  ngOnInit(): void {
    if (!this.tarjeta.incidencia) {
      this.tarjeta.incidencia = 'Sin incidencia';
    }
  }

  activarEdicionDescripcion(): void {
    this.descripcionDetalleBorrador = this.tarjeta.descripcionDetalle || '';
    this.editandoDescripcion = true;
  }

  guardarDescripcion(): void {
    this.tarjeta.descripcionDetalle = this.descripcionDetalleBorrador.trim();
    this.editandoDescripcion = false;
  }

  cancelarEdicionDescripcion(): void {
    this.editandoDescripcion = false;
  }

  get todasLasEtiquetas(): Etiqueta[] {
    return this.etiquetaService.getEtiquetas();
  }

  tieneEtiqueta(etq: Etiqueta): boolean {
    return this.tarjeta.etiquetas.some(e => e.id === etq.id || e.texto.toLowerCase() === etq.texto.toLowerCase());
  }

  toggleEtiqueta(etq: Etiqueta): void {
    const idx = this.tarjeta.etiquetas.findIndex(e => e.id === etq.id || e.texto.toLowerCase() === etq.texto.toLowerCase());
    if (idx !== -1) {
      this.tarjeta.etiquetas.splice(idx, 1);
    } else {
      this.tarjeta.etiquetas.push({ ...etq });
    }
  }

  removerEtiqueta(etqId: string, event: MouseEvent): void {
    event.stopPropagation();
    this.tarjeta.etiquetas = this.tarjeta.etiquetas.filter(e => e.id !== etqId);
  }

  eliminarTarjeta(): void {
    if (confirm(`¿Estás seguro de que deseas eliminar la tarjeta "${this.tarjeta.titulo}"?`)) {
      this.eliminar.emit(this.tarjeta.id);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.editandoDescripcion) {
      this.cancelarEdicionDescripcion();
      return;
    }
    if (this.selectorEtiquetasAbierto) {
      this.selectorEtiquetasAbierto = false;
    } else {
      this.cerrar.emit();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.cerrar.emit();
    }
  }

  enviarComentario(): void {
    const texto = this.nuevoComentario.trim();
    if (!texto) return;

    const comentario: Comentario = {
      id: `cm-${Date.now()}`,
      autor: this.currentUser.nombre,
      iniciales: this.currentUser.iniciales,
      colorAvatar: this.currentUser.color,
      texto,
      fecha: new Date()
    };

    this.tarjeta.comentarios.push(comentario);
    this.nuevoComentario = '';
  }

  onTextareaKeydown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      this.enviarComentario();
    }
  }

  get prioridadClass(): string {
    return { alta: 'prioridad--alta', media: 'prioridad--media', baja: 'prioridad--baja' }[this.tarjeta.prioridad] ?? '';
  }

  get prioridadLabel(): string {
    return { alta: '↑ Alta', media: '→ Media', baja: '↓ Baja' }[this.tarjeta.prioridad] ?? '';
  }

  formatearFecha(fecha: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(fecha));
  }

  formatearFechaRelativa(fecha: Date): string {
    const ahora = new Date();
    const diff = ahora.getTime() - new Date(fecha).getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 1) return 'ahora mismo';
    if (minutos < 60) return `hace ${minutos} min`;
    if (horas < 24) return `hace ${horas} h`;
    if (dias === 1) return 'ayer';
    return this.formatearFecha(fecha);
  }
}
