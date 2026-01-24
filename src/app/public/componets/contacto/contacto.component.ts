import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FooterPublicComponent } from '../footer/footer.component';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    FooterPublicComponent
  ],
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {
  formulario = {
    nombre: '',
    email: '',
    empresa: '',
    asunto: '',
    mensaje: ''
  };

  isLoading = false;
  showMessage = false;
  messageType: 'success' | 'error' = 'success';
  messageText = '';

  async enviarMensaje(): Promise<void> {
    // Validar campos
    if (!this.formulario.nombre || !this.formulario.email || !this.formulario.mensaje) {
      this.showMessage = true;
      this.messageType = 'error';
      this.messageText = 'Por favor completa los campos requeridos';
      setTimeout(() => this.showMessage = false, 3000);
      return;
    }

    if (!this.formulario.email.includes('@')) {
      this.showMessage = true;
      this.messageType = 'error';
      this.messageText = 'Email inválido';
      setTimeout(() => this.showMessage = false, 3000);
      return;
    }

    try {
      this.isLoading = true;
      
      // Simular envío de email (en producción, conectar a un servicio backend)
      await new Promise(resolve => setTimeout(resolve, 1500));

      this.showMessage = true;
      this.messageType = 'success';
      this.messageText = 'Mensaje enviado exitosamente. Nos pondremos en contacto pronto.';
      
      // Limpiar formulario
      this.formulario = {
        nombre: '',
        email: '',
        empresa: '',
        asunto: '',
        mensaje: ''
      };
      
      setTimeout(() => this.showMessage = false, 3000);
    } catch (error) {
      this.showMessage = true;
      this.messageType = 'error';
      this.messageText = 'Error al enviar el mensaje';
      setTimeout(() => this.showMessage = false, 3000);
    } finally {
      this.isLoading = false;
    }
  }
}
