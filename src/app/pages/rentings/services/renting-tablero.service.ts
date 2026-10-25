import { Injectable } from '@angular/core';
import { Tablero, Columna } from '../../carroceria/models/tablero.model';

@Injectable({ providedIn: 'root' })
export class RentingTableroService {


private readonly columnasComunes = [
  { id: 'col-1', nombre: 'Pendiente solicitar autorización', color: '#64748b' },
  { id: 'col-2', nombre: 'Autorización solicitada', color: '#f59e0b' },
  { id: 'col-3', nombre: 'Autorizado', color: '#10b981' },
  { id: 'col-4', nombre: 'Para facturar', color: '#6366f1' }
];

private tableros: Tablero[] = [
  {
    id: 'r1',
    nombre: 'Taller 1',
    descripcion: 'Flujo de aprobación crediticia y formalización de contratos de renting',
    color: '#0284c7',
    colorDark: '#0369a1',
    icono: '📝',
    columnas: [
      {
        ...this.columnasComunes[0],
        tarjetas: [
          {
            id: 'rt1',
            titulo: 'Renting Flota 5x Peugeot 208',
            descripcion: 'Logística Exprés S.L. · 48 meses',
            descripcionDetalle: `Solicitud de renting corporativo para 5 unidades de Peugeot 208 Allure PureTech 100CV.\n\nCondiciones: 48 meses / 25.000 km anuales por vehículo. Cuota estimada 285€/mes + IVA por unidad. Pendiente scoring financiero inicial.`,
            etiquetas: [
              { id: 're1', texto: 'Empresa', color: '#0284c7' },
              { id: 're2', texto: 'Flota', color: '#475569' }
            ],
            prioridad: 'alta',
            fechaCreacion: new Date('2026-10-21T10:00:00'),
            comentarios: [
              {
                id: 'rcm1', autor: 'Laura Gómez', iniciales: 'LG', colorAvatar: '#e91e63',
                texto: 'Documentación fiscal (Balance 2025 e IVA) recibida correctamente.',
                fecha: new Date('2026-10-22T11:20:00')
              }
            ]
          },
          {
            id: 'rt2',
            titulo: 'Mercedes Clase A 200d',
            descripcion: 'Particular · David Navarro · 36 meses',
            descripcionDetalle: 'Solicitud para Mercedes Clase A diésel. Cuota ofertada: 420€/mes con seguro a todo riesgo sin franquicia.',
            etiquetas: [{ id: 're3', texto: 'Particular', color: '#16a34a' }],
            prioridad: 'media',
            fechaCreacion: new Date('2026-10-22T15:30:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[1],
        tarjetas: [
          {
            id: 'rt3',
            titulo: 'Audi Q5 Sportback',
            descripcion: 'Clínica Dental DentalVip · 48 meses',
            descripcionDetalle: 'En revisión por el departamento de riesgos. Se solicita aval mancomunado o fianza de 2 mensualidades por antigüedad societaria menor a 2 años.',
            etiquetas: [
              { id: 're4', texto: 'Pyme', color: '#d97706' },
              { id: 're5', texto: 'Audi', color: '#1e293b' }
            ],
            prioridad: 'alta',
            fechaCreacion: new Date('2026-10-19T09:15:00'),
            comentarios: [
              {
                id: 'rcm2', autor: 'Alberto Martínez', iniciales: 'AM', colorAvatar: '#1a73e8',
                texto: 'Propuesta enviada a la financiera Santander Consumer.',
                fecha: new Date('2026-10-20T17:00:00')
              }
            ]
          }
        ]
      },
      {
        ...this.columnasComunes[2],
        tarjetas: [
          {
            id: 'rt4',
            titulo: 'Cupra Formentor VZ 310',
            descripcion: 'Autónomo · Marc Soler · 48 meses',
            descripcionDetalle: 'Riesgo aprobado sin condiciones adicionales. Contrato generado y enviado para firma digital vía DocuSign.',
            etiquetas: [{ id: 're6', texto: 'Firma Digital', color: '#10b981' }],
            prioridad: 'media',
            fechaCreacion: new Date('2026-10-18T12:00:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[3],
        tarjetas: [
          {
            id: 'rt5',
            titulo: 'Tesla Model Y Gran Autonomía',
            descripcion: 'Tech Solutions Global · 36 meses',
            descripcionDetalle: 'Contrato firmado por ambas partes. Pasa al proceso de pedido y entrega de vehículo.',
            etiquetas: [
              { id: 're7', texto: 'Eléctrico', color: '#059669' },
              { id: 're8', texto: 'Formalizado', color: '#6366f1' }
            ],
            prioridad: 'baja',
            fechaCreacion: new Date('2026-10-16T14:45:00'),
            comentarios: []
          }
        ]
      }
    ]
  },
  {
    id: 'r2',
    nombre: 'Taller 2',
    descripcion: 'Seguimiento del transporte, matriculación y entrega de los vehículos contratados',
    color: '#059669',
    colorDark: '#047857',
    icono: '🚚',
    columnas: [
      {
        ...this.columnasComunes[0],
        tarjetas: [
          {
            id: 'rt6',
            titulo: 'Volkswagen Tiguan e-Hybrid',
            descripcion: 'Transporte ferroviario · Llegada estimada 28/10',
            descripcionDetalle: 'Unidad asignada VIN: WVWZZZ5NZMW123456. En transporte desde planta de Wolfsburg hacia campa central.',
            etiquetas: [{ id: 're9', texto: 'Híbrido', color: '#0d9488' }],
            prioridad: 'media',
            fechaCreacion: new Date('2026-10-20T08:00:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[1],
        tarjetas: [
          {
            id: 'rt7',
            titulo: 'BMW Serie 3 Touring',
            descripcion: 'Matrícula en trámite DGT · Limpieza inicial',
            descripcionDetalle: 'Vehículo recibido en campa. Documentación enviada a gestoría para expedición de placas de matrícula provisionales/definitivas.',
            etiquetas: [{ id: 're10', texto: 'Matriculación', color: '#e11d48' }],
            prioridad: 'alta',
            fechaCreacion: new Date('2026-10-22T10:00:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[2],
        tarjetas: [
          {
            id: 'rt8',
            titulo: 'Hyundai Tucson 1.6 TGDI',
            descripcion: 'Cita acordada: Viernes 24/10 11:00h',
            descripcionDetalle: 'Revisión pre-entrega (PDI) completada, tarjeta de combustible cargada, bienvenida y manuales listos.',
            etiquetas: [{ id: 're11', texto: 'Cita fijada', color: '#2563eb' }],
            prioridad: 'alta',
            fechaCreacion: new Date('2026-10-21T16:00:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[3],
        tarjetas: [
          {
            id: 'rt9',
            titulo: 'Toyota Yaris Cross',
            descripcion: 'Entregado con acta firmada · 8923-MZX',
            descripcionDetalle: 'Acta de entrega firmada sin incidencias estéticas ni mecánicas. Activada la póliza de seguro y telemetría.',
            etiquetas: [{ id: 're12', texto: 'Acta OK', color: '#15803d' }],
            prioridad: 'baja',
            fechaCreacion: new Date('2026-10-15T12:00:00'),
            comentarios: []
          }
        ]
      }
    ]
  },
  {
    id: 'r3',
    nombre: 'Taller 3',
    descripcion: 'Mantenimientos preventivos, siniestros y cambios de neumáticos',
    color: '#7c3aed',
    colorDark: '#6d28d9',
    icono: '🔄',
    columnas: [
      {
        ...this.columnasComunes[0],
        tarjetas: [
          {
            id: 'rt10',
            titulo: 'Revisión Oficial 60.000 km',
            descripcion: 'Skoda Octavia · 4412-KLP',
            descripcionDetalle: 'Cambio de aceite, filtros y bujías según plan de mantenimiento estipulado por fabricante.',
            etiquetas: [{ id: 're13', texto: 'Service', color: '#3b82f6' }],
            prioridad: 'media',
            fechaCreacion: new Date('2026-10-23T08:30:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[1],
        tarjetas: [
          {
            id: 'rt11',
            titulo: 'Sustitución 4 neumáticos 225/45 R17',
            descripcion: 'Seat León · 1198-LMN (Desgaste 1.8mm)',
            descripcionDetalle: 'Autorizado juego Michelin Primacy 4 en red de talleres concertada.',
            etiquetas: [{ id: 're14', texto: 'Ruedas', color: '#ea580c' }],
            prioridad: 'alta',
            fechaCreacion: new Date('2026-10-22T13:40:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[2],
        tarjetas: [
          {
            id: 'rt12',
            titulo: 'Inspección ITV 4º Año',
            descripcion: 'Renault Megane · 0092-KTY',
            descripcionDetalle: 'Cita previa reservada para ITV de vencimiento reglamentario.',
            etiquetas: [{ id: 're15', texto: 'ITV', color: '#7c3aed' }],
            prioridad: 'baja',
            fechaCreacion: new Date('2026-10-18T10:00:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[3],
        tarjetas: [] // Columna vacía para mantener la consistencia de 4 columnas
      }
    ]
  },
  {
    id: 'r4',
    nombre: 'Backoffice',
    descripcion: 'Contratos próximos a expirar, renovaciones o peritaje de devolución',
    color: '#be185d',
    colorDark: '#9d174d',
    icono: '🏁',
    columnas: [
      {
        ...this.columnasComunes[0],
        tarjetas: [
          {
            id: 'rt13',
            titulo: 'Propuesta de Renovación Renting',
            descripcion: 'Kia Sportage · Vence 15/12/2026',
            descripcionDetalle: 'Oferta enviada al cliente para sustitución por nuevo Kia Sportage HEV o extensión contractual de 12 meses.',
            etiquetas: [{ id: 're16', texto: 'Renovación', color: '#be185d' }],
            prioridad: 'media',
            fechaCreacion: new Date('2026-10-20T11:00:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[1],
        tarjetas: [
          {
            id: 'rt14',
            titulo: 'Inspección Fin de Contrato',
            descripcion: 'Nissan Qashqai · DEKRA cita 27/10',
            descripcionDetalle: 'Peritación técnica de estado de carrocería, desgaste interior y kilómetros reales para liquidación de excesos/daños.',
            etiquetas: [{ id: 're17', texto: 'Peritaje', color: '#4f46e5' }],
            prioridad: 'alta',
            fechaCreacion: new Date('2026-10-21T09:00:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[2],
        tarjetas: [
          {
            id: 'rt15',
            titulo: 'Cierre Expediente Renting',
            descripcion: 'Citroën C4 · Facturación final aprobada',
            descripcionDetalle: 'Liquidación de fianza y cierre formal de póliza y renting.',
            etiquetas: [{ id: 're18', texto: 'Cerrado', color: '#16a34a' }],
            prioridad: 'baja',
            fechaCreacion: new Date('2026-10-10T16:00:00'),
            comentarios: []
          }
        ]
      },
      {
        ...this.columnasComunes[3],
        tarjetas: [] // Columna vacía para mantener la consistencia de 4 columnas
      }
    ]
  }
];

  getTableros(): Tablero[] {
    return this.tableros;
  }

  getTableroById(id: string): Tablero | undefined {
    return this.tableros.find(t => t.id === id);
  }

  getTotalTarjetas(tablero: Tablero): number {
    return tablero.columnas.reduce((acc: number, col: Columna) => acc + col.tarjetas.length, 0);
  }
}
