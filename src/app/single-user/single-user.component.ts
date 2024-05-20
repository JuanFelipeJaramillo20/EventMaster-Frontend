import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { getUserById } from '../../apis/getUserbyId';

import { User } from '../../types/types';

@Component({
  selector: 'app-single-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-user.component.html',
  styleUrl: './single-user.component.css',
})
export class SingleUserComponent implements OnInit {
  userId: string | null = null;

  userToShow: User | null = null;

  constructor(private route: ActivatedRoute) {}

  fetchSingleUser = async () => {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
    });
    console.log('userId', this.userId);

    if (!this.userId) return;
    const fetchedUser: any = await getUserById(this.userId);
    if (fetchedUser?.errorMessage || !fetchedUser.data) {
      // MOSTRAR NOTIFICACIÓN DE ERROR
      return;
    }
    return fetchedUser.data;
  };

  async ngOnInit(): Promise<void> {
    this.userToShow = await this.fetchSingleUser();
    console.log('eventShow', this.userToShow);
  }
}
