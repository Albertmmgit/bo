import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TarjetaArchivadaService } from '../../shared/services/tarjeta-archivada.service';
import { TableroService } from '../carroceria/services/tablero.service';
import { RentingTableroService } from '../rentings/services/renting-tablero.service';
import { Tarjeta, TipoIncidencia } from '../carroceria/models/tablero.model';

export type ModuloFiltro = 'todos' | 'carroceria' | 'renting';

interface ReportMetric {
  title: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: string;
  color: string;
}

interface EstadisticaIncidencia {
  tipo: TipoIncidencia;
  cantidad: number;
  porcentaje: number;
  color: string;
}

interface TarjetaTiempoItem {
  tarjeta: Tarjeta;
  modulo: 'Carrocería' | 'Renting';
  dias: number;
  horas: number;
  tiempoFormateado: string;
}

interface TarjetaIncidenciaItem {
  tarjeta: Tarjeta;
  modulo: 'Carrocería' | 'Renting';
  origen: string;
  incidencia: string;
  estado: string;
}

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.scss'
})
export class InformesComponent implements OnInit {
  private archivadasService = inject(TarjetaArchivadaService);
  private tableroService = inject(TableroService);
  private rentingTableroService = inject(RentingTableroService);

  pestanaActiva: 'tiempos' | 'incidencias' = 'tiempos';
  moduloSeleccionado: ModuloFiltro = 'todos';

  metrics: ReportMetric[] = [];
  tarjetasConTiempo: TarjetaTiempoItem[] = [];
  estadisticasIncidencias: EstadisticaIncidencia[] = [];
  tarjetasConIncidencia: TarjetaIncidenciaItem[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cambiarPestana(p: 'tiempos' | 'incidencias'): void {
    this.pestanaActiva = p;
  }

  seleccionarModulo(m: ModuloFiltro): void {
    this.moduloSeleccionado = m;
    this.cargarDatos();
  }

  // Helper para determinar el módulo de una tarjeta
  determinarModulo(tarjeta: Tarjeta): 'Carrocería' | 'Renting' {
    const id = tarjeta.origenTableroId || '';
    if (id.startsWith('r')) {
      return 'Renting';
    }
    return 'Carrocería';
  }

  get tiemposFiltrados(): TarjetaTiempoItem[] {
    if (this.moduloSeleccionado === 'todos') {
      return this.tarjetasConTiempo;
    }
    const target = this.moduloSeleccionado === 'carroceria' ? 'Carrocería' : 'Renting';
    return this.tarjetasConTiempo.filter(item => item.modulo === target);
  }

  get incidenciasFiltradas(): TarjetaIncidenciaItem[] {
    if (this.moduloSeleccionado === 'todos') {
      return this.tarjetasConIncidencia;
    }
    const target = this.moduloSeleccionado === 'carroceria' ? 'Carrocería' : 'Renting';
    return this.tarjetasConIncidencia.filter(item => item.modulo === target);
  }

  cargarDatos(): void {
    const archivadas = this.archivadasService.getArchivadas();

    // 1. Mapeo de tiempos con identificación del módulo
    this.tarjetasConTiempo = archivadas.map(t => {
      const creacion = new Date(t.fechaCreacion).getTime();
      const archivo = t.fechaArchivado ? new Date(t.fechaArchivado).getTime() : Date.now();
      const diffMs = Math.max(0, archivo - creacion);

      const totalHoras = Math.round(diffMs / (1000 * 60 * 60));
      const dias = Math.floor(totalHoras / 24);
      const horasRestantes = totalHoras % 24;

      const tiempoFormateado = dias > 0
        ? `${dias}d ${horasRestantes}h`
        : `${horasRestantes}h`;

      return {
        tarjeta: t,
        modulo: this.determinarModulo(t),
        dias,
        horas: totalHoras,
        tiempoFormateado
      };
    });

    // 2. Tarjetas para análisis de incidencias (activas + archivadas)
    const todasLasTarjetasConModulo: { tarjeta: Tarjeta; modulo: 'Carrocería' | 'Renting'; tableroNombre: string }[] = [];

    // Archivadas
    for (const t of archivadas) {
      todasLasTarjetasConModulo.push({
        tarjeta: t,
        modulo: this.determinarModulo(t),
        tableroNombre: t.origenTableroNombre || 'Archivadas'
      });
    }

    // Carrocería activas
    for (const tab of this.tableroService.getTableros()) {
      for (const col of tab.columnas) {
        for (const t of col.tarjetas) {
          todasLasTarjetasConModulo.push({
            tarjeta: t,
            modulo: 'Carrocería',
            tableroNombre: tab.nombre
          });
        }
      }
    }

    // Renting activas
    for (const tab of this.rentingTableroService.getTableros()) {
      for (const col of tab.columnas) {
        for (const t of col.tarjetas) {
          todasLasTarjetasConModulo.push({
            tarjeta: t,
            modulo: 'Renting',
            tableroNombre: tab.nombre
          });
        }
      }
    }

    // Filtrar incidencias reales
    const conIncidencia = todasLasTarjetasConModulo.filter(
      item => item.tarjeta.incidencia && item.tarjeta.incidencia !== 'Sin incidencia'
    );

    this.tarjetasConIncidencia = conIncidencia.map(item => ({
      tarjeta: item.tarjeta,
      modulo: item.modulo,
      origen: item.tableroNombre,
      incidencia: item.tarjeta.incidencia!,
      estado: item.tarjeta.archivada ? 'Archivada' : 'En Curso'
    }));

    // Estadísticas según el módulo seleccionado
    this.recalcularMetricasYEstadisticas(todasLasTarjetasConModulo);
  }

  private recalcularMetricasYEstadisticas(
    todas: { tarjeta: Tarjeta; modulo: 'Carrocería' | 'Renting' }[]
  ): void {
    // Filtrar datasets por módulo activo
    const listaTiempos = this.tiemposFiltrados;
    const listaIncidencias = this.incidenciasFiltradas;

    const totalTarjetasModulo = this.moduloSeleccionado === 'todos'
      ? todas.length
      : todas.filter(t => (this.moduloSeleccionado === 'carroceria' ? t.modulo === 'Carrocería' : t.modulo === 'Renting')).length;

    // Tiempo medio
    let sumaHoras = 0;
    for (const item of listaTiempos) {
      sumaHoras += item.horas;
    }
    const mediaHoras = listaTiempos.length ? Math.round(sumaHoras / listaTiempos.length) : 0;
    const diasMedios = (mediaHoras / 24).toFixed(1);

    // Agrupación de incidencias
    const conteo: Record<string, number> = {};
    for (const item of listaIncidencias) {
      conteo[item.incidencia] = (conteo[item.incidencia] || 0) + 1;
    }

    const totalInc = listaIncidencias.length;
    const colores = ['#e74c3c', '#e67e22', '#f39c12', '#8e44ad', '#2980b9', '#16a085', '#0284c7'];
    let colorIdx = 0;

    this.estadisticasIncidencias = Object.keys(conteo).map(k => ({
      tipo: k as TipoIncidencia,
      cantidad: conteo[k],
      porcentaje: totalInc ? Math.round((conteo[k] / totalInc) * 100) : 0,
      color: colores[colorIdx++ % colores.length]
    })).sort((a, b) => b.cantidad - a.cantidad);

    // Métricas para la cabecera dinámica
    const nombreModulo = this.moduloSeleccionado === 'carroceria'
      ? 'Carrocería'
      : this.moduloSeleccionado === 'renting'
      ? 'Renting'
      : 'Global';

    this.metrics = [
      {
        title: `Tiempo Medio (${nombreModulo})`,
        value: `${diasMedios} días`,
        trend: `${mediaHoras} horas medias de ciclo`,
        trendUp: true,
        icon: '⏱️',
        color: '#1a73e8'
      },
      {
        title: `Tarjetas Archivadas (${nombreModulo})`,
        value: `${listaTiempos.length}`,
        trend: 'Completadas y analizadas',
        trendUp: true,
        icon: '📦',
        color: '#27ae60'
      },
      {
        title: `Incidencias (${nombreModulo})`,
        value: `${listaIncidencias.length}`,
        trend: `${((listaIncidencias.length / (totalTarjetasModulo || 1)) * 100).toFixed(1)}% sobre total`,
        trendUp: false,
        icon: '⚠️',
        color: '#e67e22'
      },
      {
        title: `Total Operaciones (${nombreModulo})`,
        value: `${totalTarjetasModulo}`,
        trend: 'Tarjetas activas + archivadas',
        trendUp: true,
        icon: this.moduloSeleccionado === 'carroceria' ? '🔧' : this.moduloSeleccionado === 'renting' ? '🚗' : '📊',
        color: '#8e44ad'
      }
    ];
  }

  formatearFecha(fecha: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(new Date(fecha));
  }
}
