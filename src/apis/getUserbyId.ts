import { getLocalToken } from '../localStorage/handleToken';

import { GET_METHOD, ENDPOINT } from '../constants/constants';

import { RegisterApiResponse, ErrorResponse } from '../types/types';

export const getUserById = async (userId: string) => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(`${ENDPOINT}/users/${userId}`, {
      method: GET_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (response.status >= 400) {
      throw new Error(`Hubo un error, inicia sesión e intenta otra vez!: ${response.statusText}`);
    }
    if (response.status >= 404) {
      throw new Error(`Hubo un error, no se encontró el usuario!: ${response.statusText}`);
    }
    if (!response.ok) {
      throw new Error(`Hubo un error, inicia sesión e intenta otra vez!: ${response.statusText}`);
    }

    const data: RegisterApiResponse = await response.json();
    if (data.statusCode >= 400) {
      throw new Error(
        `Algo salió mal, ${data.statusCode}`
      );
    }
    if (!data) {
      throw new Error(
        `Hubo un error, inicia sesión e intenta otra vez!: ${data}`
      );
    }
    return data;
  } catch (err) {
    const errorMessage: ErrorResponse = {
      errorMessage: `${err}`,
    };
    return errorMessage;
  }
};
