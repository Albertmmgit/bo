import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface ExpedienteGarantia {
  expediente: string;       // No editable
  matricula: string;        // Editable
  marcaModelo: string;      // Editable
  cliente: string;          // Editable
  tipoAveria: string;       // Editable
  estado: string;           // Editable
  costeEstimado: number;    // Editable
  fechaApertura: string;    // Editable
  observaciones: string;    // Editable
}

@Component({
  selector: 'app-garantias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './garantias.component.html',
  styleUrl: './garantias.component.scss'
})
export class GarantiasComponent {
  estadosDisponibles: string[] = ['En Revisión', 'Aprobada', 'Pendiente Piezas', 'Rechazada', 'Completada'];

  mensajeToast: string = '';
  toastVisible: boolean = false;

  expedientes: ExpedienteGarantia[] = [
    {
      expediente: 'GAR-2026-0041',
      matricula: '1234-KBC',
      marcaModelo: 'Audi A3 Sportback',
      cliente: 'Carlos Ruiz Gómez',
      tipoAveria: 'Bomba de agua / Refrigeración',
      estado: 'En Revisión',
      costeEstimado: 485.50,
      fechaApertura: '2026-10-18',
      observaciones: 'Pérdida de líquido refrigerante en garantía oficial'
    },
    {
      expediente: 'GAR-2026-0042',
      matricula: '5678-LMN',
      marcaModelo: 'BMW Serie 1 118d',
      cliente: 'María Torres Vega',
      tipoAveria: 'Válvula EGR / Fallo motor',
      estado: 'Aprobada',
      costeEstimado: 720.00,
      fechaApertura: '2026-10-19',
      observaciones: 'Aprobado por perito de la marca sin coste para cliente'
    },
    {
      expediente: 'GAR-2026-0043',
      matricula: '9012-PQR',
      marcaModelo: 'Volkswagen Golf VIII',
      cliente: 'David Navarro Sanz',
      tipoAveria: 'Pantalla infoentretenimiento reinicios',
      estado: 'Pendiente Piezas',
      costeEstimado: 1250.00,
      fechaApertura: '2026-10-20',
      observaciones: 'Módulo MIB3 pedido a fábrica'
    },
    {
      expediente: 'GAR-2026-0044',
      matricula: '3456-JZX',
      marcaModelo: 'Peugeot 3008 GT',
      cliente: 'Empresa Renting Express S.L.',
      tipoAveria: 'Compresor aire acondicionado',
      estado: 'En Revisión',
      costeEstimado: 640.20,
      fechaApertura: '2026-10-21',
      observaciones: 'Pendiente de diagnosis con manómetros'
    },
    {
      expediente: 'GAR-2026-0045',
      matricula: '7890-TRS',
      marcaModelo: 'Toyota RAV4 Hybrid',
      cliente: 'Ana Belén Morales',
      tipoAveria: 'Sensor batería tracción HV',
      estado: 'Aprobada',
      costeEstimado: 310.00,
      fechaApertura: '2026-10-21',
      observaciones: 'Campaña técnica oficial incluida'
    },
    {
      expediente: 'GAR-2026-0046',
      matricula: '2468-VBN',
      marcaModelo: 'Seat León 1.5 eTSI',
      cliente: 'Lucas Romero Peña',
      tipoAveria: 'Ruido pastillas / Discos delanteros',
      estado: 'Rechazada',
      costeEstimado: 210.00,
      fechaApertura: '2026-10-22',
      observaciones: 'Desgaste por uso normal, no cubierto por garantía'
    },
    {
      expediente: 'GAR-2026-0047',
      matricula: '1357-CDF',
      marcaModelo: 'Ford Kuga PHEV',
      cliente: 'Sonia Gutiérrez',
      tipoAveria: 'Cargador embarcado OBC',
      estado: 'En Revisión',
      costeEstimado: 1850.00,
      fechaApertura: '2026-10-22',
      observaciones: 'Fallo al conectar toma tipo 2 Mennekes'
    },
    {
      expediente: 'GAR-2026-0048',
      matricula: '8910-KLP',
      marcaModelo: 'Mercedes-Benz CLA 200',
      cliente: 'Javier Domínguez',
      tipoAveria: 'Cámara marcha atrás sin imagen',
      estado: 'Completada',
      costeEstimado: 380.00,
      fechaApertura: '2026-10-15',
      observaciones: 'Cableado sustituido y calibrada'
    },
    {
      expediente: 'GAR-2026-0049',
      matricula: '4567-XYZ',
      marcaModelo: 'Hyundai Tucson 1.6 CRDi',
      cliente: 'Inversiones Norte S.A.',
      tipoAveria: 'Inyector AdBlue cristalizado',
      estado: 'Pendiente Piezas',
      costeEstimado: 530.00,
      fechaApertura: '2026-10-23',
      observaciones: 'Pieza en tránsito'
    },
    {
      expediente: 'GAR-2026-0050',
      matricula: '6789-QWE',
      marcaModelo: 'Cupra León VZ',
      cliente: 'Roberto Méndez',
      tipoAveria: 'Amortiguador DCC derecho con fuga',
      estado: 'Aprobada',
      costeEstimado: 890.00,
      fechaApertura: '2026-10-23',
      observaciones: 'Sustitución en pareja autorizada por marca'
    }
  ];

  enviar(): void {
    console.log('Enviando datos de garantías:', this.expedientes);
    this.mostrarToast(`✅ Se han enviado y guardado ${this.expedientes.length} expedientes de garantías correctamente.`);
  }

  agregarFila(): void {
    const nuevoId = `GAR-2026-00${this.expedientes.length + 41}`;
    const hoy = new Date().toISOString().split('T')[0];
    this.expedientes.unshift({
      expediente: nuevoId,
      matricula: '',
      marcaModelo: '',
      cliente: '',
      tipoAveria: '',
      estado: 'En Revisión',
      costeEstimado: 0,
      fechaApertura: hoy,
      observaciones: ''
    });
  }

  eliminarFila(index: number): void {
    this.expedientes.splice(index, 1);
  }

  private mostrarToast(msg: string): void {
    this.mensajeToast = msg;
    this.toastVisible = true;
    setTimeout(() => {
      this.toastVisible = false;
    }, 4000);
  }
}
