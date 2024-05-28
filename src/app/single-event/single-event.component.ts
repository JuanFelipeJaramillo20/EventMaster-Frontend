import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import Swal from 'sweetalert2';

import { getSingleEvent } from '../../apis/getEventById';
import { deleteEventById } from '../../apis/deleteEvent';
import { getAllAttendeesEvent } from '../../apis/getAllAttendeesEvent';

import { LoaderComponent } from '../loader/loader.component';

import { DeletedEventApiResponse, Event } from '../../types/types';

import {
  APP_LOGIN,
  APP_HOME,
  APP_SINGLE_USER,
} from '../../constants/constants';

import { EventRetrieved } from '../../types/types';
import { addAttendeeEvent } from '../../apis/addAttendeeEvent';
import { getUserID } from '../../localStorage/handleUserID';
import { updateEvent } from '../../apis/updateEvent';
import { deleteAttendeeEvent } from '../../apis/deleteAttendeeEvent';
import { getUserById } from '../../apis/getUserbyId';

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule, LoaderComponent, RouterLink],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css',
})
export class SingleEventComponent implements OnInit {
  eventId: string | null = null;
  isLoading: boolean = true;
  isCurrentUserCreator: boolean = false;

  isAbleToJoin: boolean = true;
  joinButtonText: string = 'Participar';
  eventToShow: EventRetrieved | any | null = null;

  userOwner: any = {};

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
    const fetchedUser: any = await getUserById(
      fetchedEvent.data.user_creator_id
    );
    this.userOwner = fetchedUser.data;
    if (fetchedEvent.data?.user_creator_id == getUserID()) {
      this.isCurrentUserCreator = true;
    }
    if (!fetchedEvent.data && fetchedEvent.data?.capacity < 1) {
      this.isAbleToJoin = false;
      this.joinButtonText = 'Lleno';
    }
    this.isLoading = false;
    return fetchedEvent.data;
  };

  isJoined = async () => {
    const userID = getUserID();
    if (!this.eventId || !userID) return;
    this.isLoading = true;
    const subscribedUsers: any = await getAllAttendeesEvent(this.eventId);
    if (
      !subscribedUsers ||
      subscribedUsers?.errorMessage ||
      !subscribedUsers.data
    ) {
      this.failureNotification(subscribedUsers?.errorMessage, true);
      this.isLoading = false;
      return;
    }
    console.log('sb', subscribedUsers);
    for (const user of subscribedUsers.data) {
      console.log(user.id, userID);
      if (user.id == userID) {
        this.isAbleToJoin = true;
        this.joinButtonText = 'Dejar de participar';
        break;
      }
    }
    this.isLoading = false;
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
    const currentEvent: Event | any = {
      name: this.eventToShow?.name,
      capacity: this.eventToShow.capacity - 1,
      description: this.eventToShow.description,
      type: this.eventToShow.type,
      user_creator_id: this.eventToShow.user_creator_id,
    };
    const updatedEvent: any = await updateEvent(currentEvent, this.eventId);
    if (!updatedEvent || updatedEvent?.errorMessage || !updatedEvent?.data) {
      this.isLoading = false;
      this.failureNotification(joinedEvent?.errorMessage, true);
      return;
    }
    this.isLoading = false;
    this.successNotification(
      'Participando',
      'Ya estas participando en este evento!'
    );
  };

  removeParticipation = async () => {
    if (!this.eventId || !this.eventToShow) return;
    this.isLoading = true;
    const currentUserID = getUserID();
    if (!currentUserID) return;
    const unjoinedEvent: any = await deleteAttendeeEvent(
      this.eventId,
      currentUserID
    );
    if (!unjoinedEvent || !unjoinedEvent?.data || unjoinedEvent.errorMessage) {
      this.failureNotification(unjoinedEvent.errorMessage, true);
      this.isLoading = false;
      return;
    }
    const currentEvent: Event | any = {
      name: this.eventToShow?.name,
      capacity: this.eventToShow.capacity + 1,
      description: this.eventToShow.description,
      type: this.eventToShow.type,
      user_creator_id: this.eventToShow.user_creator_id,
    };
    const updatedEvent: any = await updateEvent(currentEvent, this.eventId);
    if (!updatedEvent || updatedEvent?.errorMessage || !updatedEvent?.data) {
      this.isLoading = false;
      this.failureNotification(updatedEvent?.errorMessage, true);
      return;
    }
    this.isLoading = false;
    this.successNotification(
      'No participas',
      'Ya no estas participando en este evento!'
    );
  };

  navigateToUpdateEvent() {
    if (this.eventId) {
      this.router.navigate(['/update-event', this.eventId]);
    }
  }

  async ngOnInit(): Promise<void> {
    this.eventToShow = await this.fetchSingleEvent();
    this.isJoined();
    if (this.eventToShow && this.eventToShow?.capacity <= 1) {
      this.isAbleToJoin = false;
      this.joinButtonText = 'Lleno';
    }
    console.log('eventShow', this.eventToShow);
  }

  successNotification(
    title: string = 'Evento Eliminado',
    message: string = 'Se ha eliminado el evento correctamente'
  ) {
    Swal.fire(title, message, 'success').then((e) => {
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

  alertParticipateConfirmation() {
    const isLeave = this.joinButtonText == 'Dejar de participar';
    Swal.fire({
      title: 'Atención!',
      text: `Segur@ que quieres ${
        isLeave ? 'dejar de' : ''
      } participar en este evento?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        isLeave ? this.removeParticipation() : this.participate();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          `${
            isLeave ? 'Seguiras participando' : 'No participarás'
          } en el evento`,
          'error'
        );
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
