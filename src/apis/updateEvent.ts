import { getLocalToken } from '../localStorage/handleToken';

import { PUT_METHOD, ENDPOINT } from '../constants/constants';

import { EventApiResponse, ErrorResponse } from '../types/types';

export const updateEvent = async (eventId: String) => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(`${ENDPOINT}/events/${eventId}`, {
      method: PUT_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(eventId),
    });

    if (!response.ok) {
      throw new Error(`Response ok wasn't TRUE, Error: ${response.statusText}`);
    }

    const data: EventApiResponse = await response.json();
    if (data.statusCode >= 400) {
      throw new Error(
        `Create event has a different status code, ${data.statusCode}`
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
      errorMessage: `Error al actualizar el evento, ${err}`,
    };
    return errorMessage;
  }
};
