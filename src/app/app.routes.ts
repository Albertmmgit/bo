import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'rentings',
        pathMatch: 'full'
      },
      {
        path: 'rentings',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/rentings/rentings.component').then(m => m.RentingsComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/rentings/tablero/renting-tablero.component').then(m => m.RentingTableroComponent)
          }
        ]
      },
      {
        path: 'carroceria',
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/carroceria/carroceria.component').then(m => m.CarroceriaComponent)
          },
          {
            path: ':id',
            loadComponent: () =>
              import('./pages/carroceria/tablero/tablero.component').then(m => m.TableroComponent)
          }
        ]
      },
      {
        path: 'garantias',
        loadComponent: () =>
          import('./pages/garantias/garantias.component').then(m => m.GarantiasComponent)
      },
      {
        path: 'informes',
        loadComponent: () =>
          import('./pages/informes/informes.component').then(m => m.InformesComponent)
      },
      {
        path: 'administracion',
        loadComponent: () =>
          import('./pages/administracion/administracion.component').then(m => m.AdministracionComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
