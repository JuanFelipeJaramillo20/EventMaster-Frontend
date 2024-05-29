import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';

import { LoaderComponent } from '../loader/loader.component';

import { getUserById } from '../../apis/getUserbyId';

import { APP_LOGIN } from '../../constants/constants';

import { User } from '../../types/types';
import { getUserID } from '../../localStorage/handleUserID';

@Component({
  selector: 'app-single-user',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './single-user.component.html',
  styleUrl: './single-user.component.css',
})
export class SingleUserComponent implements OnInit {
  userId: string | null = null;
  isLoading: boolean = true;

  isCurrentUser: boolean = true;

  userToShow: User | null = null;

  constructor(private route: ActivatedRoute, private redirect: Router, private router: Router) {}

  fetchSingleUser = async () => {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('id');
    });
    console.log('userId', this.userId);

    this.isCurrentUser = this.userId == getUserID();
    if (!this.userId) return;
    this.isLoading = true;
    const fetchedUser: any = await getUserById(this.userId);
    if (fetchedUser?.errorMessage || !fetchedUser.data) {
      this.isLoading = false;
      this.failureNotification(fetchedUser?.errorMessage);
      return;
    }
    this.isLoading = false;
    return fetchedUser.data;
  };

  async ngOnInit(): Promise<void> {
    this.userToShow = await this.fetchSingleUser();
    console.log('eventShow', this.userToShow);
  }

  redirectToLogin() {
    this.redirect.navigate([`/${APP_LOGIN}`]);
  }

  navigateToUpdateUser() {
    if (this.userId) {
      this.router.navigate(['/update-user', this.userId]);
    }
  }

  failureNotification(error: string, isRedirect: boolean = false) {
    Swal.fire('Ups! hubo un error', error, 'error').then((e) => {
      if (isRedirect && e) {
        this.redirectToLogin();
      }
    });
  }
}
