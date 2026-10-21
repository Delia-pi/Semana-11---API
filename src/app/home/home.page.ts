import { Component, inject } from '@angular/core';
import { Libro } from '../models/libro.model';
import { OpenLibraryService } from '../services/open-library.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonToggle,
  IonCheckbox,
  IonButton,
  IonButtons,
  IonIcon,
  IonBadge,
  IonModal,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  phonePortraitOutline,
  createOutline,
  documentTextOutline,
  paperPlaneOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { BookingRequest, AVAILABLE_SERVICES, ServiceCategory } from '../models/booking-request.model';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonList,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonToggle,
    IonCheckbox,
    IonButton,
    IonButtons,
    IonIcon,
    IonBadge,
    IonModal, 
    IonGrid,
    IonRow, 
    IonCol,
  ]
})
export class HomePage {
  private readonly feedbackService = inject(FeedbackService);

  readonly services: ServiceCategory[] = AVAILABLE_SERVICES;

  formData: BookingRequest = {
    fullName: '',
    serviceType: '',
    smsNotifications: true,
    acceptTerms: false
  };

  isTermsModalOpen: boolean = false;

  constructor() {
    addIcons({
      phonePortraitOutline,
      createOutline,
      documentTextOutline,
      paperPlaneOutline,
      closeCircleOutline
    });
  }

  setTermsModalOpen(isOpen: boolean): void {
    this.isTermsModalOpen = isOpen;
  }


  async enviarSolicitud(): Promise<void> {
    const trimmedName = this.formData.fullName ? this.formData.fullName.trim() : '';

    if (!trimmedName || !this.formData.serviceType || !this.formData.acceptTerms) {
      await this.feedbackService.showToast(
        'Por favor complete los campos obligatorios (*)',
        'danger',
        3000
      );
      return;
    }

    const selectedService = this.services.find(s => s.id === this.formData.serviceType);
    const serviceName = selectedService ? selectedService.name : this.formData.serviceType;
    const smsStatusText = this.formData.smsNotifications ? 'Habilitadas (Sí)' : 'Deshabilitadas (No)';

    const summaryMessage = `
      <strong>Estudiante:</strong> ${trimmedName}<br>
      <strong>Servicio:</strong> ${serviceName}<br>
      <strong>Notificaciones SMS:</strong> ${smsStatusText}<br>
      <strong>Términos:</strong> Aceptados correctamente.<br><br>
      <em>¡Tu registro ha quedado almacenado en memoria con éxito!</em>
    `;

    await this.feedbackService.showAlert(
      '¡Solicitud Registrada con Éxito!',
      'Universidad Surcolombiana',
      summaryMessage,
      'Aceptar y Finalizar'
    );
  }

// Servicio que consulta los libros.
private servicioLibros = inject(OpenLibraryService);

// Lista de libros recibidos de la API.
libros: Libro[] = [];

// Estados de la consulta.
estaCargandoLibros: boolean = false;
mensajeErrorLibros: string = '';
busquedaRealizada: boolean = false;

// Consultar los libros de romance.
cargarLibrosRomanticos(): void {
  this.estaCargandoLibros = true;
  this.mensajeErrorLibros = '';
  this.busquedaRealizada = true;

  this.servicioLibros.buscarLibrosRomanticos().subscribe({
    next: (resultados) => {
      this.libros = resultados;
      this.estaCargandoLibros = false;
    },

    error: (errorApi: unknown) => {
      console.error('Error al consultar los libros:', errorApi);

      this.mensajeErrorLibros =
        'No fue posible cargar los libros. Intenta de nuevo.';

      this.estaCargandoLibros = false;
    }
  });
}
}
