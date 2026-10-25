import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableroService } from './services/tablero.service';
import { Tablero } from './models/tablero.model';

@Component({
  selector: 'app-carroceria',
  standalone: true,
  imports: [],
  templateUrl: './carroceria.component.html',
  styleUrl: './carroceria.component.scss'
})
export class CarroceriaComponent implements OnInit {
  private tableroService = inject(TableroService);
  private router = inject(Router);

  tableros: Tablero[] = [];

  ngOnInit(): void {
    this.tableros = this.tableroService.getTableros();
  }

  getTotalTarjetas(tablero: Tablero): number {
    return this.tableroService.getTotalTarjetas(tablero);
  }

  abrirTablero(tablero: Tablero): void {
    this.router.navigate(['/carroceria', tablero.id]);
  }
}
