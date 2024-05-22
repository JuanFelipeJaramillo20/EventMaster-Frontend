import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { LoaderComponent } from '../loader/loader.component';

import { getAllEvents } from '../../apis/getAllEvents';

import { APP_SINGLE_EVENT, APP_LOGIN } from '../../constants/constants';

import { EventRetrieved } from '../../types/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, LoaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  allFetchedEvents: EventRetrieved[] = [];

  isLoading: boolean = true;

  constructor(private router: Router) {}

  redirectToLogin() {
    this.router.navigate([`/${APP_LOGIN}`]);
  }

  ngOnInit(): void {
    this.fetchAllEvents();
  }

  fetchAllEvents = async () => {
    const allEvents: any = await getAllEvents();
    this.isLoading = true;
    if (allEvents?.errorMessage) {
      this.isLoading = false;
      this.allFetchedEvents = [];
      this.failureNotification(allEvents?.errorMessage)
    }
    this.allFetchedEvents = allEvents.data;
    this.isLoading = false;
  };

  failureNotification(error: string) {
    Swal.fire('Ups! hubo un error', error, 'error').then((e) => {
      if (e) {
        this.redirectToLogin();
      }
    });
  }
}
