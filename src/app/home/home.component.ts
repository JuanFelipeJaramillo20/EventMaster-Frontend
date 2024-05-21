import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { LoaderComponent } from '../loader/loader.component';

import { getAllEvents } from '../../apis/getAllEvents';

import { APP_SINGLE_EVENT } from '../../constants/constants';

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

  ngOnInit(): void {
    this.fetchAllEvents();
  }

  fetchAllEvents = async () => {
    const allEvents: any = await getAllEvents();
    this.isLoading = true;
    if (allEvents?.errorMessage) {
      this.isLoading = false;
      // TIRAR UN ERROR MEDIANTE EL COMPONENTE DE NOTIFICATION
      this.allFetchedEvents = [];
    }
    this.allFetchedEvents = allEvents.data;
    this.isLoading = false;
  };
}
