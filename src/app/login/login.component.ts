import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import Swal from 'sweetalert2';

import { loginUser } from '../../apis/loginUser';

import { LoaderComponent } from '../loader/loader.component';

import {
  LoginCredentials,
  ErrorResponse,
  LoginApiResponse,
} from '../../types/types';

import { addErrorInput, removeErrorInput } from '../../helpers/formHelpers';
import { setLocalToken } from '../../localStorage/handleToken';

import { APP_HOME } from '../../constants/constants';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    LoaderComponent,
    CommonModule,
  ],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  redirectToHome() {
    this.router.navigate([`/${APP_HOME}`]);
  }

  ngOnInit() {}

  validateLogin(credentials: LoginCredentials) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const spaceRegex = /^\s+/;

    const validator: any = {
      Email: () => {
        if (credentials.email.length < 1) {
          addErrorInput('email');
          return [false, 'Añade un Email'];
        }
        if (credentials.email.match(spaceRegex)) {
          addErrorInput('email');
          return [false, 'Elimina el espacio en blanco'];
        }
        if (!credentials.email.match(emailRegex)) {
          addErrorInput('email');
          return [false, 'No es un email válido'];
        }
        removeErrorInput('email');
        return [true, ''];
      },
      Contraseña: () => {
        if (credentials.password.length < 8) {
          addErrorInput('password');
          return [false, 'Contraseña muy corta'];
        }
        removeErrorInput('password');
        return [true, ''];
      },
    };

    for (const key in validator) {
      const [state, error] = validator[key]();
      if (!state) return [state, error, key];
    }
    return [true, '', ''];
  }

  getCurrentUser = async (userCredentials: LoginCredentials) => {
    this.isLoading = true;
    const loginCurrentUser: ErrorResponse | LoginApiResponse | any =
      await loginUser(userCredentials);

    if (
      loginCurrentUser?.errorMessage ||
      !loginCurrentUser?.data ||
      !loginCurrentUser?.data?.success ||
      !loginCurrentUser?.data?.access_token
    ) {
      this.failureNotification("Intentalo otra vez")
      this.isLoading = false;
      return;
    }
    this.isLoading = false;
    setLocalToken(loginCurrentUser?.data?.access_token);

    this.successNotification();
    setTimeout(() => {
      this.redirectToHome();
    }, 1500);
  };

  onSubmit() {
    console.log('loginForm', this.loginForm.value);
    if (!this.loginForm.value) return;
    const [state, error, key] = this.validateLogin(this.loginForm.value);
    console.log('hasErrors?', { state, error, key });
    if (!state || error) {
      this.failureNotification(error)
      return;
    }
    this.getCurrentUser(this.loginForm.value);
  }

  successNotification() {
    Swal.fire('Iniciaste sesión!', 'Bienvenido de nuevo', 'success');
  }
  failureNotification(error: string) {
    Swal.fire('Ups! hubo un error', error, 'error');
  }
}
