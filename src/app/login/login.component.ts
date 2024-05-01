import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { LoginCredentials } from '../../types/types';

import { addErrorInput, removeErrorInput } from '../../helpers/formHelpers';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
    return [true, 'Inicio exitoso!', ''];
  }

  onSubmit() {
    console.log(this.loginForm.value);
    if (!this.loginForm.value) return;
    const [state, error, key] = this.validateLogin(this.loginForm.value);
    console.log({
      state,
      error,
      key,
    });
  }
}
