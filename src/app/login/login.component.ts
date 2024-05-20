import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { loginUser } from '../../apis/loginUser';

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
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

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

  validateLogin(credentials: LoginCredentials): (boolean | string | string)[] {
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
    const loginCurrentUser: ErrorResponse | LoginApiResponse | any =
      await loginUser(userCredentials);

    if (
      loginCurrentUser?.errorMessage ||
      !loginCurrentUser?.data ||
      !loginCurrentUser?.data?.success ||
      !loginCurrentUser?.data?.access_token
    ) {
      // TIRAR ERROR EN NOTIFICACIÓN (ERROR DEL FETCH)
      return;
    }
    setLocalToken(loginCurrentUser?.data?.access_token);

    this.redirectToHome();
  };

  onSubmit() {
    console.log('loginForm', this.loginForm.value);
    if (!this.loginForm.value) return;
    const [state, error, key] = this.validateLogin(this.loginForm.value);
    console.log('hasErrors?', { state, error, key });
    if (!state || error) {
      // TIRAR ERROR EN NOTIFICACIÓN (FORMULARIO INVALIDO, USAR LA KEY PARA SABER CUAL INPUT FUE)
      return;
    }
    this.getCurrentUser(this.loginForm.value)

  }
}
