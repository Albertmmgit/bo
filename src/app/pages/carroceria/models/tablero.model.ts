export type Prioridad = 'alta' | 'media' | 'baja';

export type TipoIncidencia =
  | 'Sin incidencia'
  | 'Retraso de recambios'
  | 'Pintura defectuosa / Repintar'
  | 'Fallo mecánico imprevisto'
  | 'Documentación incompleta'
  | 'Discrepancia peritaje'
  | 'Problema de transporte / Logística';

export interface Etiqueta {
  id: string;
  texto: string;
  color: string;
}

export interface Comentario {
  id: string;
  autor: string;
  iniciales: string;
  colorAvatar: string;
  texto: string;
  fecha: Date;
}

export interface Tarjeta {
  id: string;
  titulo: string;
  descripcion?: string;
  descripcionDetalle?: string;
  etiquetas: Etiqueta[];
  prioridad: Prioridad;
  comentarios: Comentario[];
  fechaCreacion: Date;
  archivada?: boolean;
  fechaArchivado?: Date;
  origenTableroId?: string;
  origenTableroNombre?: string;
  origenColumnaNombre?: string;
  incidencia?: TipoIncidencia;
}

export interface Columna {
  id: string;
  nombre: string;
  color: string;
  tarjetas: Tarjeta[];
}

export interface Tablero {
  id: string;
  nombre: string;
  descripcion: string;
  color: string;
  colorDark: string;
  icono: string;
  columnas: Columna[];
}
