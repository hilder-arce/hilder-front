import { Component, Input } from '@angular/core';
import { CommonModule, NgIf, NgFor, NgSwitch, NgSwitchCase } from '@angular/common';

interface Activity {
  id: string;
  type: 'create' | 'update' | 'delete' | 'alert';
  title: string;
  description: string;
  timestamp: Date;
  user?: string;
  icon?: string;
}

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, NgSwitch, NgSwitchCase],
  template: `
    <div class="group h-full">
      <!-- Gradient Border Effect -->
      <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-500 pointer-events-none"></div>

      <!-- Card Content -->
      <div class="relative bg-white rounded-xl border border-blue-200/50 group-hover:border-blue-400/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
        
        <!-- Header with Gradient Line -->
        <div class="h-1 w-full bg-gradient-to-r from-blue-600 to-purple-600"></div>

        <!-- Title Section -->
        <div class="p-6 border-b border-gray-200">
          <h3 class="text-lg font-bold text-gray-900 mb-1">Actividad Reciente</h3>
          <p class="text-sm text-gray-600">Últimas operaciones del sistema</p>
        </div>

        <!-- Activity List -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4 space-y-4 max-h-96">
            <div *ngIf="activities && activities.length > 0; else noActivities">
              <div *ngFor="let activity of activities; let last = last" 
                   class="flex gap-4 pb-4"
                   [class.border-b]="!last"
                   [class.border-gray-200]="!last">
                
                <!-- Icon -->
                <div [class]="'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ' + getActivityColor(activity.type)">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" [ngSwitch]="activity.type">
                    <!-- Create Icon -->
                    <g *ngSwitchCase="'create'" class="text-green-600">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                    </g>
                    <!-- Update Icon -->
                    <g *ngSwitchCase="'update'" class="text-blue-600">
                      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M3 16a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16M21 4v7h-7M3 20v-7h7"/>
                    </g>
                    <!-- Delete Icon -->
                    <g *ngSwitchCase="'delete'" class="text-red-600">
                      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
                    </g>
                    <!-- Alert Icon -->
                    <g *ngSwitchCase="'alert'" class="text-amber-500">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                    </g>
                  </svg>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1">
                      <p class="text-sm font-semibold text-gray-900 truncate">{{ activity.title }}</p>
                      <p class="text-xs text-gray-600 mt-0.5 line-clamp-2">{{ activity.description }}</p>
                      <p class="text-xs text-gray-500 mt-2">
                        {{ activity.user ? activity.user + ' • ' : '' }}{{ formatTime(activity.timestamp) }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ng-template #noActivities>
              <div class="text-center py-8">
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h-6m0 0H6"></path>
                </svg>
                <p class="text-gray-500 text-sm">Sin actividades recientes</p>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button class="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
            Ver más actividades →
          </button>
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
export class RecentActivityComponent {
  @Input() activities: Activity[] = [];

  getActivityColor(type: string): string {
    const colors: { [key: string]: string } = {
      'create': 'bg-green-100 border border-green-300',
      'update': 'bg-blue-100 border border-blue-300',
      'delete': 'bg-red-100 border border-red-300',
      'alert': 'bg-amber-100 border border-amber-300'
    };
    return colors[type] || 'bg-gray-200 border border-gray-300';
  }

  formatTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'Hace unos segundos';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    return `Hace ${days}d`;
  }
}
