import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

import { RegisterCredentials } from '../../types/types';

import { addErrorInput, removeErrorInput } from '../../helpers/formHelpers';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fullName: [
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

  validateRegister(credentials: RegisterCredentials) {
    const nameRegex = /^[A-Za-z -]*$/;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const spaceRegex = /^\s+/;

    const validator: any = {
      Nombre: () => {
        if (credentials.fullName.length < 2) {
          addErrorInput('fullName');
          return [false, 'El nombre es muy corto'];
        }
        if (credentials.fullName.length > 50) {
          addErrorInput('fullName');
          return [false, 'El nombre es muy largo'];
        }
        if (!credentials.fullName.match(nameRegex)) {
          addErrorInput('fullName');
          return [false, 'El nombre no es válido'];
        }
        removeErrorInput('fullName');
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
    return [true, 'Registro exitoso!', ''];
  }

  onSubmit() {
    console.log('registerForm', this.registerForm.value);
    if (!this.registerForm.value) return;
    const [state, error, key] = this.validateRegister(this.registerForm.value);
    console.log({
      state,
      error,
      key,
    });
  }
}
