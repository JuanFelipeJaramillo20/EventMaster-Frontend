import { getLocalToken } from '../localStorage/handleToken';

import { POST_METHOD, ENDPOINT } from '../constants/constants';

import { EventApiResponse, ErrorResponse, Event } from '../types/types';

export const createNewEvent = async (newEvent: Event) => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(`${ENDPOINT}/events`, {
      method: POST_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify(newEvent),
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
      errorMessage: `Error al crear el evento, ${err}`,
    };
    return errorMessage;
  }
};
