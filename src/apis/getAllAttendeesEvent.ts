import { getLocalToken } from '../localStorage/handleToken';

import { GET_METHOD, ENDPOINT } from '../constants/constants';

import { ErrorResponse, JoinedToEventResponse } from '../types/types';

export const getAllAttendeesEvent = async (eventId: number | string) => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(`${ENDPOINT}/events/${eventId}/attendees`, {
      method: GET_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Inicia sesión e intenta otra vez ${response.statusText}`
      );
    }

    const data: JoinedToEventResponse = await response.json();
    if (data.statusCode >= 400) {
      throw new Error(`Inicia sesión e intenta otra vez ${data.statusCode}`);
    }
    if (!data) {
      throw new Error(`Inicia sesión e intenta otra vez ${data}`);
    }
    return data;
  } catch (err) {
    const errorMessage: ErrorResponse = {
      errorMessage: `${err}`,
    };
    return errorMessage;
  }
};
