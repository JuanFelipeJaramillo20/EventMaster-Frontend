import { getLocalToken } from '../localStorage/handleToken';

import { POST_METHOD, ENDPOINT } from '../constants/constants';

import { ErrorResponse, DeletedEventApiResponse } from '../types/types';

export const deleteAttendeeEvent = async (eventId: string, userID: number | string) => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(
      `${ENDPOINT}/events/${eventId}/removeAttendee`,
      {
        method: POST_METHOD,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
        body: JSON.stringify({
          userId: userID,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Inicia sesión e intenta de nuevo ${response.statusText}`);
    }

    const data: DeletedEventApiResponse = await response.json();
    if (data.statusCode >= 400) {
      throw new Error(
        `Inicia sesión e intenta de nuevo ${data.statusCode}`
      );
    }
    if (!data) {
      throw new Error(
        `Inicia sesión e intenta de nuevo ${data}`
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
