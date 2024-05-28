import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';


import { getSingleEvent } from '../../apis/getEventById';
import { deleteEventById } from '../../apis/deleteEvent';

import { LoaderComponent } from '../loader/loader.component';

import { DeletedEventApiResponse } from '../../types/types';

import { APP_LOGIN, APP_HOME } from '../../constants/constants';

import { EventRetrieved } from '../../types/types';

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css',
})
export class SingleEventComponent implements OnInit {
  eventId: string | null = null;
  isLoading: boolean = true;

  eventToShow: EventRetrieved | null = null;

  constructor(private route: ActivatedRoute, private redirect: Router, private router: Router) {}

  redirectToLogin() {
    this.redirect.navigate([`/${APP_LOGIN}`]);
  }

  fetchSingleEvent = async () => {
    this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('id');
    });
    console.log('eventid', this.eventId);

    if (!this.eventId) return;
    this.isLoading = true;
    const fetchedEvent: any = await getSingleEvent(this.eventId);
    if (fetchedEvent?.errorMessage || !fetchedEvent.data) {
      this.isLoading = false;
      this.failureNotification(fetchedEvent.errorMessage);
      this.redirect.navigate([`/${APP_HOME}`]);
      return;
    }
    this.isLoading = false;
    return fetchedEvent.data;
  };

  deleteEvent = async () => {
    if (!this.eventId) return;
    this.isLoading = true;
    const deletedEvent: DeletedEventApiResponse | any = await deleteEventById(
      this.eventId
    );
    if (
      !deletedEvent?.data ||
      deletedEvent.statusCode >= 400 ||
      deletedEvent?.errorMessage
    ) {
      this.isLoading = false;
      this.failureNotification('Inicia sesión e intenta otra vez!', true);
      return;
    }
    console.log('deleted: ', this.eventId);
    this.isLoading = false;
    this.successNotification();
  };

  navigateToUpdateEvent() {
    if (this.eventId) {
      this.router.navigate(['/update-event', this.eventId]);
    }
  }

  async ngOnInit(): Promise<void> {
    this.eventToShow = await this.fetchSingleEvent();
    console.log('eventShow', this.eventToShow);
  }

  successNotification() {
    Swal.fire(
      'Evento Eliminado',
      'Se ha eliminado el evento correctamente',
      'success'
    ).then((e) => {
      if (e) {
        this.redirect.navigate([`/${APP_HOME}`]);
      }
    });
  }

  alertConfirmation() {
    Swal.fire({
      title: 'Atención!',
      text: 'Segur@ que quieres eliminar este evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'No Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.deleteEvent();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'Este evento no se eliminará', 'error');
      }
    });
  }

  failureNotification(error: string, isRedirect: boolean = false) {
    Swal.fire('Ups! hubo un error', error, 'error').then((e) => {
      if (isRedirect && e) {
        this.redirectToLogin();
      }
    });
  }
}
