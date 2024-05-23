import { getLocalToken } from '../localStorage/handleToken';

import { GET_METHOD, ENDPOINT } from '../constants/constants';

import { EventsGetApiResponse, ErrorResponse } from '../types/types';

export const getAllEvents = async () => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(`${ENDPOINT}/events`, {
      method: GET_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (response.status >= 404) {
      throw new Error(`No se encontraron registros`)
    }
    if (response.status >= 400) {
      throw new Error(`Inicia sesión e intenta otra vez!`)
    }
    if (!response.ok) {
      throw new Error(`Error en la petición: ${response.statusText}`);
    }

    const data: EventsGetApiResponse = await response.json();
    if (data.statusCode >= 400) {
      throw new Error(`Inicia sesión e intenta otra vez!, ${data.statusCode}`);
    }
    if (!data) {
      throw new Error(
        `Inicia sesión e intenta otra vez!, ${data}`
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
