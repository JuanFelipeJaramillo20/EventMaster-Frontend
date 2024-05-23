import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { APP_LOGIN } from '../../constants/constants';

import { removeLocalToken } from '../../localStorage/handleToken';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  showNavigation = false;

  constructor(private router: Router) {}

  redirectToLogin() {
    removeLocalToken();
    this.successNotification();
    this.router.navigate([`/${APP_LOGIN}`]);
  }

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.showNavigation = event.url !== '/' && event.url !== '/register';
      });
  }

  successNotification() {
    Swal.fire(
      'Cerraste sesión!',
      'Se ha cerrado sesión correctamente',
      'success'
    );
  }

  alertConfirmation() {
    Swal.fire({
      title: 'Atención!',
      text: 'Segur@ que quieres cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cerrrar sesión',
      denyButtonText: 'Quedarse',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.value) {
        this.redirectToLogin();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelado', 'No cerraste sesión', 'error');
      }
    });
  }
}
