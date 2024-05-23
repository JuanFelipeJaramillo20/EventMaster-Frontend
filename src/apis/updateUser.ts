import { getLocalToken } from '../localStorage/handleToken';

import { PUT_METHOD, ENDPOINT } from '../constants/constants';

import { UserApiResponse, ErrorResponse } from '../types/types';

export const updateUser = async (userId: string) => {
  let token = getLocalToken() || '';
  try {
    const response = await fetch(`${ENDPOINT}/users/${userId}`, {
      method: PUT_METHOD,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
    });

    if (!response.ok) {
      throw new Error(`Response ok wasn't TRUE, Error: ${response.statusText}`);
    }

    const data: UserApiResponse = await response.json();
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
      errorMessage: `Error al actualizar usuario, ${err}`,
    };
    return errorMessage;
  }
};
