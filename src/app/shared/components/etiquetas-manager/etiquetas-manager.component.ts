import { Component, inject, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtiquetaService } from '../../services/etiqueta.service';
import { Etiqueta } from '../../../pages/carroceria/models/tablero.model';

@Component({
  selector: 'app-etiquetas-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './etiquetas-manager.component.html',
  styleUrl: './etiquetas-manager.component.scss'
})
export class EtiquetasManagerComponent {
  private etiquetaService = inject(EtiquetaService);

  @Output() cerrar = new EventEmitter<void>();

  paletaColores: string[] = [
    '#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#16a085',
    '#3498db', '#2980b9', '#8e44ad', '#2c3e50', '#e91e63',
    '#0284c7', '#059669', '#d97706', '#475569'
  ];

  nuevoTexto: string = '';
  nuevoColor: string = '#3498db';

  etiquetaEnEdicion: Etiqueta | null = null;
  editTexto: string = '';
  editColor: string = '';

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrar.emit();
  }

  get etiquetas(): Etiqueta[] {
    return this.etiquetaService.getEtiquetas();
  }

  crear(): void {
    if (!this.nuevoTexto.trim()) return;
    this.etiquetaService.crearEtiqueta(this.nuevoTexto, this.nuevoColor);
    this.nuevoTexto = '';
  }

  iniciarEdicion(etq: Etiqueta): void {
    this.etiquetaEnEdicion = etq;
    this.editTexto = etq.texto;
    this.editColor = etq.color;
  }

  guardarEdicion(): void {
    if (this.etiquetaEnEdicion && this.editTexto.trim()) {
      this.etiquetaService.actualizarEtiqueta(this.etiquetaEnEdicion.id, this.editTexto, this.editColor);
      this.cancelarEdicion();
    }
  }

  cancelarEdicion(): void {
    this.etiquetaEnEdicion = null;
    this.editTexto = '';
    this.editColor = '';
  }

  eliminar(id: string): void {
    this.etiquetaService.eliminarEtiqueta(id);
    if (this.etiquetaEnEdicion?.id === id) {
      this.cancelarEdicion();
    }
  }
}
