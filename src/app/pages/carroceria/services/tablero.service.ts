import { Injectable } from '@angular/core';
import { Tablero } from '../models/tablero.model';

@Injectable({ providedIn: 'root' })
export class TableroService {

  private tableros: Tablero[] = [
    {
      id: '1',
      nombre: 'Carrocería',
      descripcion: 'Seguimiento de todas las reparaciones de carrocería en curso',
      color: '#e67e22',
      colorDark: '#ca6f1e',
      icono: '🔨',
      columnas: [
        {
          id: 'c1-1', nombre: 'Enviadas para cerrar', color: '#e74c3c',
          tarjetas: [
            {
              id: 't1',
              titulo: 'Sustitución parachoques trasero',
              descripcion: 'BMW X5 · 1234-ABC',
              descripcionDetalle: `El vehículo BMW X5 (matrícula 1234-ABC) presenta daños severos en el parachoques trasero tras una colisión en aparcamiento. Se requiere sustitución completa de la pieza incluyendo sensores de aparcamiento y cámara trasera.\n\nEl presupuesto inicial aprobado es de 1.850€ (pieza original BMW + mano de obra). La pieza está en pedido con ETA de 3 días laborables. El vehículo permanecerá en el taller hasta la llegada de la pieza.`,
              etiquetas: [
                { id: 'e1', texto: 'Urgente', color: '#e74c3c' },
                { id: 'e2', texto: 'BMW', color: '#2c3e50' }
              ],
              prioridad: 'alta',
              fechaCreacion: new Date('2026-10-20T09:30:00'),
              comentarios: [
                {
                  id: 'cm1', autor: 'Carlos Ruiz', iniciales: 'CR', colorAvatar: '#8e44ad',
                  texto: 'He contactado con el proveedor BMW. La pieza llegará el miércoles. Confirmo que incluye los sensores de aparcamiento originales.',
                  fecha: new Date('2026-10-21T10:15:00')
                },
                {
                  id: 'cm2', autor: 'Alberto Martínez', iniciales: 'AM', colorAvatar: '#1a73e8',
                  texto: 'El cliente ha confirmado que quiere también revisar el estado del maletero. Añadir a la orden de trabajo.',
                  fecha: new Date('2026-10-22T16:40:00')
                }
              ]
            },
            {
              id: 't2',
              titulo: 'Pintura lateral derecho',
              descripcion: 'Seat León · 5678-DEF',
              descripcionDetalle: `Seat León (5678-DEF) con arañazo profundo en toda la parte lateral derecha desde el paso de rueda delantero hasta la puerta trasera. El daño afecta la pintura y ha llegado al metal en dos zonas.\n\nTrabajo a realizar: lijado, aplicación de masilla, aparejo, pintura en cabina y barnizado. Color: Rojo Desire (código LC3H). Se ha comprobado el código de color en el bastidor.`,
              etiquetas: [
                { id: 'e3', texto: 'Pintura', color: '#3498db' }
              ],
              prioridad: 'media',
              fechaCreacion: new Date('2026-10-21T11:00:00'),
              comentarios: [
                {
                  id: 'cm3', autor: 'María López', iniciales: 'ML', colorAvatar: '#27ae60',
                  texto: 'Código de color verificado con el fabricante. Tenemos el tono exacto en stock. Podemos comenzar mañana si el vehículo está disponible.',
                  fecha: new Date('2026-10-22T09:00:00')
                }
              ]
            }
          ]
        },
        {
          id: 'c1-2', nombre: 'OR con error', color: '#f39c12',
          tarjetas: [
            {
              id: 't3',
              titulo: 'Reparación aleta delantera',
              descripcion: 'Audi A4 · 9012-GHI',
              descripcionDetalle: `Audi A4 (9012-GHI) con aleta delantera izquierda abollada tras golpe con bordillo. La pieza es susceptible de reparación (no sustitución) mediante técnica de plancha sin pintura (PDR) en la zona superior. La zona inferior requiere masilla y pintura.\n\nVehículo actualmente en cabina para trabajos de plancha. Estimación de entrega: 24 horas.`,
              etiquetas: [
                { id: 'e4', texto: 'Chapa', color: '#8e44ad' },
                { id: 'e5', texto: 'Audi', color: '#1a5276' }
              ],
              prioridad: 'media',
              fechaCreacion: new Date('2026-10-22T08:00:00'),
              comentarios: [
                {
                  id: 'cm4', autor: 'José Fernández', iniciales: 'JF', colorAvatar: '#e67e22',
                  texto: 'Trabajo de PDR completado en zona superior. Iniciando masilla en zona inferior. Sin novedades.',
                  fecha: new Date('2026-10-23T14:00:00')
                },
                {
                  id: 'cm5', autor: 'Alberto Martínez', iniciales: 'AM', colorAvatar: '#1a73e8',
                  texto: 'El cliente pregunta si puede pasar a recoger mañana por la mañana. Confirmar con taller.',
                  fecha: new Date('2026-10-23T15:30:00')
                }
              ]
            }
          ]
        },
        {
          id: 'c1-3', nombre: 'Falta plataforma Ayvens', color: '#3498db',
          tarjetas: [
            {
              id: 't4',
              titulo: 'Retoque capó',
              descripcion: 'Toyota Corolla · 3456-JKL',
              descripcionDetalle: 'Pequeñas marcas de granizo en el capó. Tratamiento PDR completado, pendiente revisión final de calidad.',
              etiquetas: [{ id: 'e6', texto: 'Retoque', color: '#27ae60' }],
              prioridad: 'baja',
              fechaCreacion: new Date('2026-10-19T10:00:00'),
              comentarios: []
            }
          ]
        },
        {
          id: 'c1-3', nombre: 'Pendiente envío Mutua 48h', color: '#3498db',
          tarjetas: [
            {
              id: 't4',
              titulo: 'Retoque capó',
              descripcion: 'Toyota Corolla · 3456-JKL',
              descripcionDetalle: 'Pequeñas marcas de granizo en el capó. Tratamiento PDR completado, pendiente revisión final de calidad.',
              etiquetas: [{ id: 'e6', texto: 'Retoque', color: '#27ae60' }],
              prioridad: 'baja',
              fechaCreacion: new Date('2026-10-19T10:00:00'),
              comentarios: []
            }
          ]
        },
        {
          id: 'c1-4', nombre: 'Pendiente enviar compañia', color: '#27ae60',
          tarjetas: [
            {
              id: 't5',
              titulo: 'Cambio luna delantera',
              descripcion: 'Ford Focus · 7890-MNO',
              descripcionDetalle: 'Sustitución de luna delantera con fisura. Trabajo completado y vehículo entregado al cliente.',
              etiquetas: [{ id: 'e7', texto: 'Cristal', color: '#16a085' }],
              prioridad: 'baja',
              fechaCreacion: new Date('2026-10-18T09:00:00'),
              comentarios: []
            }
          ]
        }
      ]
    },
    
  ];

  getTableros(): Tablero[] {
    return this.tableros;
  }

  getTableroById(id: string): Tablero | undefined {
    return this.tableros.find(t => t.id === id);
  }

  getTotalTarjetas(tablero: Tablero): number {
    return tablero.columnas.reduce((acc, col) => acc + col.tarjetas.length, 0);
  }
}
