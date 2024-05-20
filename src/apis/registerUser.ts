import {
  RegisterCredentials,
  RegisterApiResponse,
  ErrorResponse,
} from '../types/types';
import { ENDPOINT, POST_METHOD } from '../constants/constants';

export const registerUser = async (newUser: RegisterCredentials) => {
  try {
    const response = await fetch(`${ENDPOINT}/users`, {
      method: POST_METHOD,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      throw new Error(`Response ok wasn't TRUE, Error: ${response.statusText}`);
    }

    const data: RegisterApiResponse = await response.json();
    if (!data) {
      throw new Error(`Data cannot be undefined, check status code`);
    }
    return data;
  } catch (err) {
    const errorMessage: ErrorResponse = {
      errorMessage: `Error al registrar el usuario, ${err}`,
    };
    return errorMessage;
  }
};
