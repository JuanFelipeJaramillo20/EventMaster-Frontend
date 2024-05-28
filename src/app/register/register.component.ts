import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';

import Swal from 'sweetalert2';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { registerUser } from '../../apis/registerUser';

import { LoaderComponent } from '../loader/loader.component';

import {
  RegisterCredentials,
  ErrorResponse,
  RegisterApiResponse,
} from '../../types/types';

import { addErrorInput, removeErrorInput } from '../../helpers/formHelpers';

import { APP_LOGIN } from '../../constants/constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    LoaderComponent,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.registerForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.min(2),
          Validators.max(50),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.min(2),
          Validators.max(50),
          Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  redirectToLogin() {
    this.router.navigate([`/${APP_LOGIN}`]);
  }

  validateRegister(credentials: RegisterCredentials) {
    const nameRegex = /^[A-Za-z -]*$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const spaceRegex = /^\s+/;

    const validator: any = {
      Nombre: () => {
        if (credentials.firstName.length < 2) {
          addErrorInput('firstName');
          return [false, 'El Nombre es muy corto'];
        }
        if (credentials.firstName.length > 50) {
          addErrorInput('firstName');
          return [false, 'El Nombre es muy largo'];
        }
        if (!credentials.firstName.match(nameRegex)) {
          addErrorInput('firstName');
          return [false, 'El Nombre no es válido'];
        }
        removeErrorInput('firstName');
        return [true, ''];
      },
      Apellido: () => {
        if (credentials.lastName.length < 2) {
          addErrorInput('lastName');
          return [false, 'El Apellido es muy corto'];
        }
        if (credentials.lastName.length > 50) {
          addErrorInput('lastName');
          return [false, 'El Apellido es muy largo'];
        }
        if (!credentials.lastName.match(nameRegex)) {
          addErrorInput('lastName');
          return [false, 'El Apellido no es válido'];
        }
        removeErrorInput('lastName');
        return [true, ''];
      },
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

  getNewUser = async (userCredentials: RegisterCredentials) => {
    this.isLoading = true;
    const registeredUser: ErrorResponse | RegisterApiResponse | any =
      await registerUser(userCredentials);

    if (registeredUser?.errorMessage || !registeredUser?.data) {
      this.failureNotification('Intentalo nuevamente por favor');
      this.isLoading = false;
      return;
    }
    this.isLoading = false;
    this.successNotification();
  };

  onSubmit() {
    console.log('registerForm', this.registerForm.value);
    if (!this.registerForm.value) return;
    const [state, error, key] = this.validateRegister(this.registerForm.value);
    console.log('hasErrors?', { state, error, key });
    if (!state || error) {
      this.failureNotification(error);
      return;
    }
    this.getNewUser(this.registerForm.value);
  }

  successNotification() {
    Swal.fire('Registrado!', 'Te has registrado correctamente', 'success').then(
      (e) => {
        if (e) {
          this.redirectToLogin();
        }
      }
    );
  }
  failureNotification(error: string) {
    Swal.fire('Hubo un error', error, 'warning');
  }

}
