import { POST_METHOD, ENDPOINT } from '../constants/constants';

import {
  LoginCredentials,
  LoginApiResponse,
  ErrorResponse,
} from '../types/types';

export const loginUser = async (currentUser: LoginCredentials) => {
  try {
    const response = await fetch(`${ENDPOINT}/login`, {
      method: POST_METHOD,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentUser),
    });

    if (!response.ok) {
      throw new Error(`Response ok wasn't TRUE, Error: ${response.statusText}`);
    }

    const data: LoginApiResponse = await response.json();
    if (!data) {
      throw new Error(`Data cannot be undefined, check status code`);
    }
    return data;
  } catch (err) {
    const errorMessage: ErrorResponse = {
      errorMessage: `Error al iniciar sesión, ${err}`,
    };
    return errorMessage;
  }
};
