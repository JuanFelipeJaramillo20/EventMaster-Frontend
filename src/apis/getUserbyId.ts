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

    if (!response.ok) {
      throw new Error(`Response ok wasn't TRUE, Error: ${response.statusText}`);
    }

    const data: RegisterApiResponse = await response.json();
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
      errorMessage: `Error al hacer fetch para obtener un usuario, ${err}`,
    };
    return errorMessage;
  }
};
