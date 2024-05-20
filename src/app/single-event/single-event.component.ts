import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { getSingleEvent } from '../../apis/getEventById';
import { deleteEventById } from '../../apis/deleteEvent';

import { DeletedEventApiResponse } from '../../types/types';

import { EventRetrieved } from '../../types/types';

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css',
})
export class SingleEventComponent implements OnInit {
  eventId: string | null = null;

  eventToShow: EventRetrieved | null = null;

  constructor(private route: ActivatedRoute) {}

  fetchSingleEvent = async () => {
    this.route.paramMap.subscribe((params) => {
      this.eventId = params.get('id');
    });
    console.log('eventid', this.eventId);

    if (!this.eventId) return;
    const fetchedEvent: any = await getSingleEvent(this.eventId);
    if (fetchedEvent?.errorMessage || !fetchedEvent.data) {
      // MOSTRAR NOTIFICACIÓN DE ERROR
      return;
    }
    return fetchedEvent.data;
  };

  deleteEvent = async () => {
    if (!this.eventId) return;
    await deleteEventById(this.eventId);
    console.log('deleted: ', this.eventId);
  };

  async ngOnInit(): Promise<void> {
    this.eventToShow = await this.fetchSingleEvent();
    console.log('eventShow', this.eventToShow);
  }
}
