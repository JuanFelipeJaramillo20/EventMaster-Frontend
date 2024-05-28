import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { getSingleEvent } from '../../apis/getEventById';
import { deleteEventById } from '../../apis/deleteEvent';
import { UpdateEventComponent } from '../update-event/update-event.component';

import { LoaderComponent } from '../loader/loader.component';

import { DeletedEventApiResponse, Event } from '../../types/types';

import { APP_LOGIN, APP_HOME } from '../../constants/constants';

import { EventRetrieved } from '../../types/types';
import { addAttendeeEvent } from '../../apis/addAttendeeEvent';
import { getUserID } from '../../localStorage/handleUserID';
import { updateEvent } from '../../apis/updateEvent';

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

  isAbleToJoin: boolean = true;
  eventToShow: EventRetrieved | null = null;

  constructor(
    private route: ActivatedRoute,
    private redirect: Router,
    private router: Router
  ) {}

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
      this.isAbleToJoin = false;
      this.failureNotification(fetchedEvent.errorMessage);
      this.redirect.navigate([`/${APP_HOME}`]);
      return;
    }
    if (this.eventToShow && this.eventToShow?.capacity < 1) {
      this.isAbleToJoin = false;
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

  participate = async () => {
    if (!this.eventId || !this.isAbleToJoin || !this.eventToShow) return;
    this.isLoading = true;
    const currentUserID = getUserID();
    if (!currentUserID) return;
    const joinedEvent: any = await addAttendeeEvent(
      this.eventId,
      currentUserID
    );
    if (!joinedEvent || joinedEvent?.errorMessage || !joinedEvent?.data) {
      this.isLoading = false;
      this.failureNotification(joinedEvent?.errorMessage, true);
      return;
    }
    const currentEvent: Event = {
      name: this.eventToShow?.name,
      capacity: this.eventToShow.capacity - 1,
      description: this.eventToShow.description,
      type: this.eventToShow.type,
    };
    const updatedEvent: any = await updateEvent(currentEvent, this.eventId);
    if (!updatedEvent || updatedEvent?.errorMessage || !updatedEvent?.data) {
      this.isLoading = false;
      this.failureNotification(joinedEvent?.errorMessage, true);
      return;
    }
    this.isLoading = false;
    this.successNotification('Ya estas participando en este evento!');
  };

  navigateToUpdateEvent() {
    if (this.eventId) {
      this.router.navigate(['/update-event', this.eventId]);
    }
  }

  async ngOnInit(): Promise<void> {
    this.eventToShow = await this.fetchSingleEvent();
    if (this.eventToShow && this.eventToShow?.capacity <= 1) {
      this.isAbleToJoin = false;
    }
    console.log('eventShow', this.eventToShow);
  }

  successNotification(message: string = 'Evento Eliminado') {
    Swal.fire(
      message,
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
