import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { LoaderComponent } from '../loader/loader.component';

import { createNewEvent } from '../../apis/createEvent';

import { addErrorInput, removeErrorInput } from '../../helpers/formHelpers';

import { Event } from '../../types/types';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, CommonModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css',
})
export class CreateEventComponent {
  createEventForm: FormGroup;

  isLoading: boolean = false;

  constructor(private fb: FormBuilder) {
    this.createEventForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
      type: ['', Validators.required],
      capacity: [8, Validators.required],
      description: ['', Validators.required],
    });
  }

  validateCreateEvent = (newEvent: Event) => {
    const validator: any = {
      Nombre: () => {
        if (newEvent.name.length < 1) {
          addErrorInput('name');
          return [false, 'Añade un nombre al evento'];
        }
        if (newEvent.name.length > 20) {
          addErrorInput('name');
          return [false, 'El nombre del evento es muy largo'];
        }
        removeErrorInput('name');
        return [true, ''];
      },
      Tipo: () => {
        if (newEvent.type.length <= 1) {
          addErrorInput('type');
          return [false, 'Añade un tipo de evento'];
        }
        if (newEvent.type.length > 20) {
          addErrorInput('type');
          return [false, 'El tipo del evento es muy largo, (20 máximo)'];
        }
        if (!newEvent.type.match(/^[A-Za-zÀ-ÖØ-öø-ÿ]+$/)) {
          addErrorInput('type');
          return [false, 'El tipo del evento es inválido'];
        }
        removeErrorInput('type');
        return [true, ''];
      },
      Capacidad: () => {
        if (newEvent.capacity < 1) {
          addErrorInput('capacity');
          return [false, 'La capacidad del evento es muy pequeña'];
        }
        if (newEvent.capacity > 200000) {
          addErrorInput('capacity');
          return [false, 'La capacidad del evento es muy alta'];
        }
        removeErrorInput('capacity');
        return [true, ''];
      },
      descripción: () => {
        if (newEvent.description.length < 8) {
          addErrorInput('description');
          return [false, 'La descripción del evento es muy corta'];
        }
        if (newEvent.description.length > 500) {
          addErrorInput('name');
          return [false, 'La descripción no puede ser tan larga'];
        }
        removeErrorInput('name');
        return [true, ''];
      },
    };

    for (const key in validator) {
      const [state, error] = validator[key]();
      if (!state) return [state, error, key];
    }
    return [true, '', ''];
  };

  createEvent = async (newEvent: Event) => {
    this.isLoading = true;
    const createdEvent: any = await createNewEvent(newEvent);
    if (createdEvent?.errorMessage || !createdEvent?.data) {
      // TIRAR UNA NOTIFICACIÓN DICIENDO PQ NO SE PUDO HACER
      this.isLoading = false;
    }
    this.isLoading = false;
    this.successNotification();
  };

  onSubmit() {
    console.log('createEvent', this.createEventForm.value);
    if (!this.createEventForm.value) return;
    const [state, error, key] = this.validateCreateEvent(
      this.createEventForm.value
    );
    console.log('hasErrors?', { state, error, key });
    if (!state || error) {
      this.failureNotification(error);
      return;
    }
    this.createEvent(this.createEventForm.value);
  }

  successNotification() {
    Swal.fire(
      'Evento Creado',
      'Se ha creado el evento correctamente',
      'success'
    );
  }
  failureNotification(error: string) {
    Swal.fire('Evento no creado', error, 'error');
  }
}
