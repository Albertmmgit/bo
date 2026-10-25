import { Injectable } from '@angular/core';
import { Tarjeta, Tablero, Columna } from '../../pages/carroceria/models/tablero.model';

@Injectable({ providedIn: 'root' })
export class TarjetaArchivadaService {
  private archivadas: Tarjeta[] = [
    {
      id: 'arch-1',
      titulo: 'Pulido de faros delanteros',
      descripcion: 'Seat Ibiza · 3311-HHJ',
      descripcionDetalle: 'Pulido y lacado de policarbonato con protección UV finalizada.',
      etiquetas: [{ id: 'e1', texto: 'Chapa', color: '#8e44ad' }],
      prioridad: 'baja',
      fechaCreacion: new Date('2026-10-12T09:00:00'),
      fechaArchivado: new Date('2026-10-14T17:30:00'),
      archivada: true,
      origenTableroId: '1',
      origenTableroNombre: 'Reparaciones Activas',
      origenColumnaNombre: 'Completado',
      incidencia: 'Sin incidencia',
      comentarios: []
    },
    {
      id: 'arch-2',
      titulo: 'Sustitución luna trasera térmica',
      descripcion: 'Volkswagen Polo · 7788-KKM',
      descripcionDetalle: 'Luna original montada y verificada conexión antivaho.',
      etiquetas: [{ id: 'e7', texto: 'Cristal', color: '#16a085' }],
      prioridad: 'media',
      fechaCreacion: new Date('2026-10-15T10:30:00'),
      fechaArchivado: new Date('2026-10-18T12:00:00'),
      archivada: true,
      origenTableroId: '1',
      origenTableroNombre: 'Reparaciones Activas',
      origenColumnaNombre: 'Completado',
      incidencia: 'Retraso de recambios',
      comentarios: []
    },
    {
      id: 'arch-3',
      titulo: 'Reparación lateral y barnizado',
      descripcion: 'BMW Serie 2 · 4455-LLK',
      descripcionDetalle: 'Pintura y barniz secado al horno.',
      etiquetas: [{ id: 'e3', texto: 'Pintura', color: '#3498db' }],
      prioridad: 'alta',
      fechaCreacion: new Date('2026-10-10T08:00:00'),
      fechaArchivado: new Date('2026-10-15T16:00:00'),
      archivada: true,
      origenTableroId: '1',
      origenTableroNombre: 'Reparaciones Activas',
      origenColumnaNombre: 'Completado',
      incidencia: 'Pintura defectuosa / Repintar',
      comentarios: []
    },
    {
      id: 'arch-4',
      titulo: 'Contrato Renting 4x Furgonetas',
      descripcion: 'Mensajería Veloz S.L.',
      descripcionDetalle: 'Formalización de flota 4 unidades Peugeot Partner.',
      etiquetas: [{ id: 're1', texto: 'Empresa', color: '#0284c7' }],
      prioridad: 'media',
      fechaCreacion: new Date('2026-10-11T11:00:00'),
      fechaArchivado: new Date('2026-10-16T15:20:00'),
      archivada: true,
      origenTableroId: 'r1',
      origenTableroNombre: 'Nuevas Solicitudes y Estudios',
      origenColumnaNombre: 'Formalizado',
      incidencia: 'Documentación incompleta',
      comentarios: []
    },
    {
      id: 'arch-5',
      titulo: 'Entrega Mercedes GLC 300e',
      descripcion: 'Transporte especial concesionario',
      descripcionDetalle: 'Vehículo entregado con acta firmada.',
      etiquetas: [{ id: 're9', texto: 'Híbrido', color: '#0d9488' }],
      prioridad: 'baja',
      fechaCreacion: new Date('2026-10-18T14:00:00'),
      fechaArchivado: new Date('2026-10-20T10:00:00'),
      archivada: true,
      origenTableroId: 'r2',
      origenTableroNombre: 'Entregas y Puesta a Punto',
      origenColumnaNombre: 'Entregado al Cliente',
      incidencia: 'Problema de transporte / Logística',
      comentarios: []
    }
  ];

  getArchivadas(): Tarjeta[] {
    return this.archivadas;
  }

  getArchivadasPorTablero(tableroId: string): Tarjeta[] {
    return this.archivadas.filter(t => t.origenTableroId === tableroId);
  }

  archivarTarjeta(tarjeta: Tarjeta, tablero: Tablero, columna: Columna): void {
    const tarjetaArchivada: Tarjeta = {
      ...tarjeta,
      archivada: true,
      fechaArchivado: new Date(),
      origenTableroId: tablero.id,
      origenTableroNombre: tablero.nombre,
      origenColumnaNombre: columna.nombre,
      incidencia: tarjeta.incidencia || 'Sin incidencia'
    };

    // Quitar de la columna del tablero activo
    columna.tarjetas = columna.tarjetas.filter(t => t.id !== tarjeta.id);

    // Añadir a la lista de archivadas
    this.archivadas.unshift(tarjetaArchivada);
  }

  restaurarTarjeta(tarjeta: Tarjeta, tablero: Tablero): void {
    if (!tablero.columnas.length) return;

    let columnaDestino = tablero.columnas.find(c => c.nombre === tarjeta.origenColumnaNombre);
    if (!columnaDestino) {
      columnaDestino = tablero.columnas[0];
    }

    tarjeta.archivada = false;
    delete tarjeta.fechaArchivado;
    columnaDestino.tarjetas.unshift(tarjeta);

    this.archivadas = this.archivadas.filter(t => t.id !== tarjeta.id);
  }

  eliminarDefinitivamente(tarjetaId: string): void {
    this.archivadas = this.archivadas.filter(t => t.id !== tarjetaId);
  }
}
