import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AlertService {

  // MOSTRAR ALERTA
  show(message: string, type: 'success' | 'error') {

    const old = document.querySelector('.enterprise-alert-overlay');
    if (old) old.remove();

    document.body.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.className = 'enterprise-alert-overlay';

    const box = document.createElement('div');
    box.className = `enterprise-alert enterprise-alert-${type}`;

    box.innerHTML = `
      <div class="enterprise-alert-header">
        <div class="enterprise-alert-icon">
          ${type === 'success' ? this.successIcon() : this.errorIcon()}
        </div>
        <div class="enterprise-alert-heading">
          ${type === 'success' ? 'Operación completada' : 'Error del sistema'}
        </div>
      </div>

      <div class="enterprise-alert-body">
        ${message}
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    setTimeout(() => {
      box.classList.add('enterprise-alert-hide');

      setTimeout(() => {
        document.body.style.overflow = '';
        overlay.remove();
      }, 220);

    }, 2000);
  }

  private successIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `;
  }

  private errorIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <circle cx="12" cy="12" r="9"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    `;
  }

  //ALERTA DE CONFIRMACIÓN
  confirm(
    message: string,
    options?: {
      title?: string;
      confirmText?: string;
      cancelText?: string;
      danger?: boolean;
    }
  ): Promise<boolean> {

    return new Promise(resolve => {

      const old = document.querySelector('.enterprise-alert-overlay');
      if (old) old.remove();

      document.body.style.overflow = 'hidden';

      const overlay = document.createElement('div');
      overlay.className = 'enterprise-alert-overlay';

      const box = document.createElement('div');
      box.className = `enterprise-alert enterprise-alert-confirm
        ${options?.danger ? 'enterprise-alert-danger' : ''}`;

      box.innerHTML = `
        <div class="enterprise-alert-header">
          <div class="enterprise-alert-icon">
            ${this.warningIcon()}
          </div>
          <div class="enterprise-alert-heading">
            ${options?.title ?? 'Confirmar acción'}
          </div>
        </div>

        <div class="enterprise-alert-body">
          ${message}
        </div>

        <div class="enterprise-alert-actions">
          <button class="enterprise-btn-cancel">
            ${options?.cancelText ?? 'Cancelar'}
          </button>

          <button class="enterprise-btn-confirm">
            ${options?.confirmText ?? 'Confirmar'}
          </button>
        </div>
      `;

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      const cleanup = (result: boolean) => {
        box.classList.add('enterprise-alert-hide');
        setTimeout(() => {
          document.body.style.overflow = '';
          overlay.remove();
          resolve(result);
        }, 200);
      };

      box.querySelector('.enterprise-btn-cancel')!
        .addEventListener('click', () => cleanup(false));

      box.querySelector('.enterprise-btn-confirm')!
        .addEventListener('click', () => cleanup(true));
    });
  }

  private warningIcon() {
    return `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
        <path d="M12 9v4" stroke-linecap="round"/>
        <circle cx="12" cy="16" r="1"/>
        <path d="M10.3 3.7h3.4l7 12.6a1.5 1.5 0 0 1-1.3 2.3H3.6a1.5 1.5 0 0 1-1.3-2.3z"
              stroke-linejoin="round"/>
      </svg>
    `;
  }


}
