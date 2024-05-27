import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { CreateEventComponent } from './create-event/create-event.component';

import {
  APP_HOME,
  APP_LOGIN,
  APP_REGISTER,
  APP_CREATE_EVENT,
  APP_SINGLE_EVENT,
  APP_SINGLE_USER,
  APP_UPDATE_EVENT,
} from '../constants/constants';
import { SingleUserComponent } from './single-user/single-user.component';
import { SingleEventComponent } from './single-event/single-event.component';
import { UpdateEventComponent } from './update-event/update-event.component';

export const routes: Routes = [
  {
    path: APP_LOGIN,
    component: LoginComponent,
  },
  {
    path: APP_REGISTER,
    component: RegisterComponent,
  },
  {
    path: APP_HOME,
    component: HomeComponent,
  },
  {
    path: APP_CREATE_EVENT,
    component: CreateEventComponent,
  },
  {
    path: `${APP_SINGLE_USER}/:id`,
    component: SingleUserComponent,
  },
  {
    path: `${APP_SINGLE_EVENT}/:id`,
    component: SingleEventComponent,
  },
  {
    path: `${APP_UPDATE_EVENT}/:id`,
    component: UpdateEventComponent,
  },
];
