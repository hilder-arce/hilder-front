import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterPublicComponent } from '../footer/footer.component';

@Component({
  selector: 'app-nosotros',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FooterPublicComponent
  ],
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.css']
})
export class NosotrosComponent {
  equipo = [
    {
      nombre: 'Juan Pérez',
      puesto: 'CEO & Fundador',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Juan',
      bio: 'Experto en soluciones mineras con 20+ años de experiencia'
    },
    {
      nombre: 'María García',
      puesto: 'CTO & Co-Fundadora',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
      bio: 'Ingeniera de software especializada en sistemas críticos'
    },
    {
      nombre: 'Carlos López',
      puesto: 'Director de Operaciones',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
      bio: 'Gestor de proyectos con experiencia en minería moderna'
    },
    {
      nombre: 'Ana Martínez',
      puesto: 'Directora de Producto',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      bio: 'Estratega de producto enfocada en experiencia del usuario'
    }
  ];

  valores = [
    {
      titulo: 'Trabajo en Equipo',
      descripcion: 'Transmitimos nuestras ideas claras y directas para encontrar las mejores estrategias',
      icono: '🤝'
    },
    {
      titulo: 'Innovación',
      descripcion: 'Buscamos siempre desarrollar procesos para mejorar la forma de hacer las cosas',
      icono: '💡'
    },
    {
      titulo: 'Responsabilidad',
      descripcion: 'Cumplimos con los compromisos asumidos',
      icono: '✅'
    },
    {
      titulo: 'Excelencia',
      descripcion: 'Evaluamos permanentemente el desempeño de nuestro equipo de trabajo',
      icono: '⭐'
    }
  ];
}
