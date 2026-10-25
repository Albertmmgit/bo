import { Injectable } from '@angular/core';
import { Etiqueta } from '../../pages/carroceria/models/tablero.model';

@Injectable({ providedIn: 'root' })
export class EtiquetaService {
  private etiquetas: Etiqueta[] = [
    { id: 'etq-1', texto: 'Urgente', color: '#e74c3c' },
    { id: 'etq-2', texto: 'BMW', color: '#2c3e50' },
    { id: 'etq-3', texto: 'Pintura', color: '#3498db' },
    { id: 'etq-4', texto: 'Chapa', color: '#8e44ad' },
    { id: 'etq-5', texto: 'Audi', color: '#1a5276' },
    { id: 'etq-6', texto: 'Retoque', color: '#27ae60' },
    { id: 'etq-7', texto: 'Cristal', color: '#16a085' },
    { id: 'etq-8', texto: 'Empresa', color: '#0284c7' },
    { id: 'etq-9', texto: 'Flota', color: '#475569' },
    { id: 'etq-10', texto: 'Particular', color: '#16a34a' },
    { id: 'etq-11', texto: 'Pyme', color: '#d97706' },
    { id: 'etq-12', texto: 'Firma Digital', color: '#10b981' },
    { id: 'etq-13', texto: 'Eléctrico', color: '#059669' },
    { id: 'etq-14', texto: 'Híbrido', color: '#0d9488' }
  ];

  getEtiquetas(): Etiqueta[] {
    return this.etiquetas;
  }

  crearEtiqueta(texto: string, color: string): Etiqueta {
    const nueva: Etiqueta = {
      id: `etq-${Date.now()}`,
      texto: texto.trim(),
      color
    };
    this.etiquetas.push(nueva);
    return nueva;
  }

  actualizarEtiqueta(id: string, texto: string, color: string): void {
    const etq = this.etiquetas.find(e => e.id === id);
    if (etq) {
      etq.texto = texto.trim();
      etq.color = color;
    }
  }

  eliminarEtiqueta(id: string): void {
    const idx = this.etiquetas.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.etiquetas.splice(idx, 1);
    }
  }
}
