import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { LoaderComponent } from '../loader/loader.component';
import { updateUser } from '../../apis/updateUser';
import { addErrorInput, removeErrorInput } from '../../helpers/formHelpers';

import { APP_HOME, APP_LOGIN } from '../../constants/constants';
import { getUserById } from '../../apis/getUserbyId';
import { getUserID } from '../../localStorage/handleUserID';
import {
  RegisterCredentials,
  ErrorResponse,
  RegisterApiResponse,
} from '../../types/types';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [ReactiveFormsModule, LoaderComponent, CommonModule],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css'
})
export class UpdateUserComponent {
  updateUserForm: FormGroup;
  isLoading: boolean = false;
  userId: string | null = null;
  isCurrentUser: boolean = true;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.updateUserForm = this.fb.group({
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

  redirectToHome() {
    this.router.navigate([`/${APP_HOME}`]);
  }

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
      const userData = fetchedUser.data;
      this.updateUserForm.setValue({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: '',
      });
      this.isLoading = false;
      return fetchedUser.data;
  };
  

  ngOnInit() {
    this.fetchSingleUser();
  }

  validateData(credentials: RegisterCredentials) {
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

  

  update_user = async (user: RegisterCredentials | any, userId: String) => {
    this.isLoading = true;
    const updatedUser: ErrorResponse | RegisterApiResponse | any =
      await updateUser({...user, user_creator_id: getUserID() || ''}, userId);

    if (updatedUser?.errorMessage || !updatedUser?.data) {
      this.failureNotification('Intentalo nuevamente por favor');
      this.isLoading = false;
      return;
    }
    this.isLoading = false;
    this.successNotification();
  };

  onSubmit() {
    console.log('updateForm', this.updateUserForm.value);
    if (!this.updateUserForm.value) return;
    const [state, error, key] = this.validateData(this.updateUserForm.value);
    console.log('hasErrors?', { state, error, key });
    if (!state || error) {
      this.failureNotification(error);
      return;
    }
    this.update_user(this.updateUserForm.value, this.userId!);
  }

  successNotification() {
    Swal.fire('Actualizado!', 'Se ha actualizado correctamente', 'success').then(
      (e) => {
        if (e) {
          this.redirectToHome();
        }
      }
    );
  }
  failureNotification(error: string) {
    Swal.fire('Hubo un error', error, 'warning');
  }
}
