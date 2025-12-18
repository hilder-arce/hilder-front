import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

 show(message: string, type: 'success' | 'error') {

  // Elimina alerta previa si existe
  const old = document.querySelector('.custom-alert-overlay');
  if (old) old.remove();

  // Bloquea scroll como alert nativo
  document.body.style.overflow = 'hidden';

  // Overlay
  const overlay = document.createElement('div');
  overlay.classList.add('custom-alert-overlay');

  // Caja
  const box = document.createElement('div');
  box.classList.add(
    'custom-alert-box',
    type === 'success' ? 'custom-alert-success' : 'custom-alert-error'
  );

  // Iconos
  const icon =
    type === 'success'
      ? `
        <svg class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`
      : `
        <svg class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
      `;

  // Contenido
  box.innerHTML = `
    <div class="custom-alert-icon-wrapper">
      ${icon}
    </div>
    <div class="custom-alert-title">
      ${type === 'success' ? 'Operación exitosa' : 'Error'}
    </div>
    <div class="custom-alert-message">
      ${message}
    </div>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Auto-cierre con animación
  setTimeout(() => {
    box.style.animation = 'fadeOutAlert 0.25s forwards';

    setTimeout(() => {
      document.body.style.overflow = '';
      overlay.remove();
    }, 250);

  }, 1800);
}


}
