import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RentingTableroService } from './services/renting-tablero.service';
import { Tablero } from '../carroceria/models/tablero.model';

@Component({
  selector: 'app-rentings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rentings.component.html',
  styleUrl: './rentings.component.scss'
})
export class RentingsComponent implements OnInit {
  private rentingService = inject(RentingTableroService);
  private router = inject(Router);

  tableros: Tablero[] = [];

  ngOnInit(): void {
    this.tableros = this.rentingService.getTableros();
  }

  getTotalTarjetas(tablero: Tablero): number {
    return this.rentingService.getTotalTarjetas(tablero);
  }

  abrirTablero(tablero: Tablero): void {
    this.router.navigate(['/rentings', tablero.id]);
  }
}
