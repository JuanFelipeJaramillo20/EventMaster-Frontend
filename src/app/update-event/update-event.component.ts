import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getSingleEvent } from '../../apis/getEventById';

import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { LoaderComponent } from '../loader/loader.component';

import { updateEvent } from '../../apis/updateEvent';

import { addErrorInput, removeErrorInput } from '../../helpers/formHelpers';

import { Event } from '../../types/types';

@Component({
  selector: 'app-update-event',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, CommonModule],
  templateUrl: './update-event.component.html',
  styleUrl: './update-event.component.css'
})
export class UpdateEventComponent implements OnInit{
  updateEventForm: FormGroup;
  isLoading: boolean = false;
  eventId: string | null = null;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.updateEventForm = this.fb.group({
      name: ['',Validators.required],
      type: ['', Validators.required],
      capacity: [8, Validators.required],
      description: ['', Validators.required],
    });

    this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('id');
    });
  }

  ngOnInit() {
    this.fetchSingleEvent();
  }

  fetchSingleEvent = async () => {
    this.route.paramMap.subscribe(async (params) => {
      this.eventId = params.get('id');
      if (!this.eventId) return;
      this.isLoading = true;
      try {
        const fetchedEvent: any = await getSingleEvent(this.eventId);
        if (fetchedEvent?.errorMessage || !fetchedEvent.data) {
          this.isLoading = false;
          // MOSTRAR NOTIFICACIÓN DE ERROR
          return;
        }
        const eventData = fetchedEvent.data;
        this.updateEventForm.setValue({
          name: eventData.name,
          type: eventData.type,
          capacity: eventData.capacity,
          description: eventData.description
        });
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        // MANEJAR ERROR
      }
    });
  };

  validateUpdateEvent = (newEvent: Event) => {
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

  update_Event = async (event: Event, eventId: String) => {
    this.isLoading = true;
    const updatedEvent: any = await updateEvent(event, eventId);
    if (updatedEvent?.errorMessage || !updatedEvent?.data) {
      // TIRAR UNA NOTIFICACIÓN DICIENDO PQ NO SE PUDO HACER
      this.isLoading = false;
    }
    this.isLoading = false;
    this.successNotification();
    this.router.navigate(['/home']);
  };

  onSubmit() {
    console.log('updateEvent', this.updateEventForm.value);
    if (!this.updateEventForm.value) return;
    const [state, error, key] = this.validateUpdateEvent(
      this.updateEventForm.value
    );
    console.log('hasErrors?', { state, error, key });
    if (!state || error) {
      this.failureNotification(error);
      return;
    }
    
    this.update_Event(this.updateEventForm.value, this.eventId!);
  }

  successNotification() {
    Swal.fire(
      'Evento Actualizado',
      'Se ha actualizado el evento correctamente',
      'success'
    );
  }
  failureNotification(error: string) {
    Swal.fire('Evento no actualizado', error, 'error');
  }
}
