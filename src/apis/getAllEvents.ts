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

    if (!response.ok) {
      throw new Error(`Response ok wasn't TRUE, Error: ${response.statusText}`);
    }

    const data: EventsGetApiResponse = await response.json();
    if (data.statusCode >= 400) {
      throw new Error(`status code is not ok, ${data.statusCode}`);
    }
    if (!data) {
      throw new Error(
        `Data cannot be undefined, check status code, data: ${data}`
      );
    }
    return data;
  } catch (err) {
    const errorMessage: ErrorResponse = {
      errorMessage: `Error al registrar el usuario, ${err}`,
    };
    return errorMessage;
  }
};
