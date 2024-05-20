import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { getAllEvents } from '../../apis/getAllEvents';

import { APP_SINGLE_EVENT } from '../../constants/constants';

import { EventRetrieved } from '../../types/types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  allFetchedEvents: EventRetrieved[] = [];

  ngOnInit(): void {
    this.fetchAllEvents();
  }

  fetchAllEvents = async () => {
    const allEvents: any = await getAllEvents();
    if (allEvents?.errorMessage) {
      // TIRAR UN ERROR MEDIANTE EL COMPONENTE DE NOTIFICATION
      this.allFetchedEvents = [];
    }
    this.allFetchedEvents = allEvents.data;
  };
}
