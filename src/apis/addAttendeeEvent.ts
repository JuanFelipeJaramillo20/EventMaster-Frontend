import { getLocalToken } from '../localStorage/handleToken';

import { POST_METHOD, ENDPOINT } from '../constants/constants';

import { ErrorResponse, EventApiResponse } from '../types/types';

export const addAttendeeEvent = async (eventId: string) => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(`${ENDPOINT}/events/${eventId}/addAttendee`, {
      method: POST_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Response ok wasn't TRUE, Error: ${response.statusText}`);
    }

    const data: EventApiResponse = await response.json();
    if (data.statusCode >= 400) {
      throw new Error(
        `Get user has a different status code, ${data.statusCode}`
      );
    }
    if (!data) {
      throw new Error(
        `Data cannot be undefined, check status code, data: ${data}`
      );
    }
    return data;
  } catch (err) {
    const errorMessage: ErrorResponse = {
      errorMessage: `Error al hacer fetch para añadir participante a un evento, ${err}`,
    };
    return errorMessage;
  }
};
