import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tarjeta, Tablero } from '../../../pages/carroceria/models/tablero.model';
import { TarjetaArchivadaService } from '../../services/tarjeta-archivada.service';

@Component({
  selector: 'app-tarjetas-archivadas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tarjetas-archivadas.component.html',
  styleUrl: './tarjetas-archivadas.component.scss'
})
export class TarjetasArchivadasComponent {
  private archivadasService = inject(TarjetaArchivadaService);

  @Input() tableroActual?: Tablero;
  @Output() cerrar = new EventEmitter<void>();

  filtroTexto: string = '';
  verSoloDeEsteTablero: boolean = true;

  get archivadas(): Tarjeta[] {
    let lista = this.archivadasService.getArchivadas();
    if (this.verSoloDeEsteTablero && this.tableroActual) {
      lista = lista.filter(t => t.origenTableroId === this.tableroActual?.id);
    }

    if (!this.filtroTexto.trim()) {
      return lista;
    }

    const q = this.filtroTexto.toLowerCase();
    return lista.filter(t =>
      t.titulo.toLowerCase().includes(q) ||
      t.descripcion?.toLowerCase().includes(q) ||
      t.origenColumnaNombre?.toLowerCase().includes(q) ||
      t.etiquetas.some(e => e.texto.toLowerCase().includes(q))
    );
  }

  restaurar(tarjeta: Tarjeta): void {
    if (!this.tableroActual) return;
    this.archivadasService.restaurarTarjeta(tarjeta, this.tableroActual);
  }

  eliminarPermanente(id: string): void {
    if (confirm('¿Eliminar definitivamente esta tarjeta archivada?')) {
      this.archivadasService.eliminarDefinitivamente(id);
    }
  }

  formatearFecha(fecha?: Date): string {
    if (!fecha) return '-';
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(fecha));
  }
}
