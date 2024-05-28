import { getLocalToken } from '../localStorage/handleToken';

import { GET_METHOD, ENDPOINT } from '../constants/constants';

import { ErrorResponse, EventApiResponse } from '../types/types';

export const getSingleEvent = async (eventId: string) => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(`${ENDPOINT}/events/${eventId}`, {
      method: GET_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (response.status >= 404) {
      throw new Error(`No se econtró el evento`);
    }
    if (response.status >= 400) {
      throw new Error(`Hubo un error en la petición`);
    }
    if (!response.ok) {
      throw new Error(
        `Inicia sesión e intentalo otra vez!, ${response.statusText}`
      );
    }

    const data: EventApiResponse = await response.json();
    if (data.statusCode == 404) {
      throw new Error(`No se econtró el evento, ${data.statusCode}`);
    }
    if (data.statusCode >= 400) {
      throw new Error(`Hubo un error en la petición, ${data.statusCode}`);
    }
    if (!data) {
      throw new Error(`Inicia sesión e intentalo otra vez!, data: ${data}`);
    }
    return data;
  } catch (err) {
    const errorMessage: ErrorResponse = {
      errorMessage: `${err}`,
    };
    return errorMessage;
  }
};
