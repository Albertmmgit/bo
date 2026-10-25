import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: 'Administrador' | 'Gestor de Taller' | 'Mecánico' | 'Atención Cliente';
  estado: 'Activo' | 'Inactivo';
  avatarColor: string;
  ultimoAcceso: string;
}

@Component({
  selector: 'app-administracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administracion.component.html',
  styleUrl: './administracion.component.scss'
})
export class AdministracionComponent {
  filtroTexto: string = '';
  filtroRol: string = 'Todos';

  usuarios: Usuario[] = [
    {
      id: 'usr-1',
      nombre: 'Alberto Martínez',
      email: 'alberto@concesionario.com',
      rol: 'Administrador',
      estado: 'Activo',
      avatarColor: '#1a73e8',
      ultimoAcceso: 'Hoy, 20:45'
    },
    {
      id: 'usr-2',
      nombre: 'Carlos Ruiz',
      email: 'carlos.ruiz@taller.com',
      rol: 'Gestor de Taller',
      estado: 'Activo',
      avatarColor: '#8e44ad',
      ultimoAcceso: 'Hoy, 18:30'
    },
    {
      id: 'usr-3',
      nombre: 'María López',
      email: 'maria.lopez@taller.com',
      rol: 'Mecánico',
      estado: 'Activo',
      avatarColor: '#27ae60',
      ultimoAcceso: 'Ayer, 16:15'
    },
    {
      id: 'usr-4',
      nombre: 'José Fernández',
      email: 'jose.fernandez@taller.com',
      rol: 'Mecánico',
      estado: 'Inactivo',
      avatarColor: '#e67e22',
      ultimoAcceso: '12/10/2026'
    },
    {
      id: 'usr-5',
      nombre: 'Laura Gómez',
      email: 'laura.gomez@renting.com',
      rol: 'Atención Cliente',
      estado: 'Activo',
      avatarColor: '#e91e63',
      ultimoAcceso: 'Hoy, 19:10'
    }
  ];

  roles: string[] = ['Todos', 'Administrador', 'Gestor de Taller', 'Mecánico', 'Atención Cliente'];

  modalAbierto: boolean = false;
  usuarioEdicion: Partial<Usuario> = {};
  modoEdicion: boolean = false;

  get usuariosFiltrados(): Usuario[] {
    return this.usuarios.filter(u => {
      const coincideTexto = u.nombre.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
                            u.email.toLowerCase().includes(this.filtroTexto.toLowerCase());
      const coincideRol = this.filtroRol === 'Todos' || u.rol === this.filtroRol;
      return coincideTexto && coincideRol;
    });
  }

  abrirCrearUsuario(): void {
    this.modoEdicion = false;
    this.usuarioEdicion = {
      nombre: '',
      email: '',
      rol: 'Mecánico',
      estado: 'Activo',
      avatarColor: '#1a73e8'
    };
    this.modalAbierto = true;
  }

  editarUsuario(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioEdicion = { ...usuario };
    this.modalAbierto = true;
  }

  guardarUsuario(): void {
    if (!this.usuarioEdicion.nombre || !this.usuarioEdicion.email) return;

    if (this.modoEdicion && this.usuarioEdicion.id) {
      const idx = this.usuarios.findIndex(u => u.id === this.usuarioEdicion.id);
      if (idx !== -1) {
        this.usuarios[idx] = { ...this.usuarios[idx], ...this.usuarioEdicion } as Usuario;
      }
    } else {
      const colores = ['#1a73e8', '#8e44ad', '#27ae60', '#e67e22', '#e91e63', '#16a085'];
      const nuevo: Usuario = {
        id: `usr-${Date.now()}`,
        nombre: this.usuarioEdicion.nombre!,
        email: this.usuarioEdicion.email!,
        rol: this.usuarioEdicion.rol as any || 'Mecánico',
        estado: this.usuarioEdicion.estado as any || 'Activo',
        avatarColor: colores[Math.floor(Math.random() * colores.length)],
        ultimoAcceso: 'Nunca'
      };
      this.usuarios.unshift(nuevo);
    }
    this.modalAbierto = false;
  }

  toggleEstado(usuario: Usuario): void {
    usuario.estado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';
  }

  eliminarUsuario(id: string): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarios = this.usuarios.filter(u => u.id !== id);
    }
  }
}
