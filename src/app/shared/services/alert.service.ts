import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  show(message: string, type: 'success' | 'error') {

    const old = document.querySelector('.custom-alert-overlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.classList.add('custom-alert-overlay');

    const box = document.createElement('div');
    box.classList.add('custom-alert-box');
    box.classList.add(type === 'success'
      ? 'custom-alert-success'
      : 'custom-alert-error'
    );

    const icon =
      type === 'success'
        ? `
      <svg class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" stroke-width="2.5">
        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`
        : `
      <svg class="custom-alert-icon" viewBox="0 0 24 24" fill="none" stroke="#ff5e5e" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `;

    box.innerHTML = `
      ${icon}
      <div class="custom-alert-title">
        ${type === 'success' ? 'Operación Exitosa' : 'Error'}
      </div>
      <div class="custom-alert-message">${message}</div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    setTimeout(() => {
      box.style.animation = 'fadeOutAlert 0.35s forwards';
      setTimeout(() => overlay.remove(), 350);
    }, 1600);
  }

}
