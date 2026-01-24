import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative bg-gradient-to-r from-white to-blue-50 border-b border-blue-200/40">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl"></div>
      </div>

      <div class="relative z-10 px-6 py-12">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between">
            <!-- Left Content -->
            <div class="mb-6 md:mb-0">
              <div class="flex items-center gap-4 mb-4">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg blur opacity-50"></div>
                  <div class="relative bg-white px-4 py-2 rounded-lg border border-blue-300">
                    <span class="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 uppercase tracking-widest">ANALYTICS</span>
                  </div>
                </div>
              </div>

              <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                Panel de Control
                <span class="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-red-500">
                  Enterprise Elite
                </span>
              </h1>

              <p class="text-gray-600 text-lg max-w-2xl">
                Monitorea en tiempo real todos tus activos, inventario y operaciones. 
                Toma decisiones estratégicas basadas en datos precisos y actualizados.
              </p>
            </div>

            <!-- Right Stats -->
            <div class="grid grid-cols-3 gap-4 md:ml-8">
              <div class="group cursor-pointer">
                <div class="bg-white backdrop-blur border border-blue-200 rounded-lg p-4 group-hover:border-blue-400 transition-all duration-300 shadow-sm">
                  <p class="text-gray-600 text-sm font-semibold mb-2">Última Actualización</p>
                  <p class="text-xl font-bold text-gray-900">Hace 2m</p>
                </div>
              </div>

              <div class="group cursor-pointer">
                <div class="bg-white backdrop-blur border border-green-200 rounded-lg p-4 group-hover:border-green-400 transition-all duration-300 shadow-sm">
                  <p class="text-gray-600 text-sm font-semibold mb-2">Sistema</p>
                  <p class="text-xl font-bold text-green-600">Óptimo</p>
                </div>
              </div>

              <div class="group cursor-pointer">
                <div class="bg-white backdrop-blur border border-amber-200 rounded-lg p-4 group-hover:border-amber-400 transition-all duration-300 shadow-sm">
                  <p class="text-gray-600 text-sm font-semibold mb-2">Alertas</p>
                  <p class="text-xl font-bold text-amber-500">0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class DashboardHeroComponent {}
