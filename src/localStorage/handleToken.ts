import { TOKEN_NAME } from '../constants/constants';

export const setLocalToken = (token: string) => {
  if (!token) return;
  window.localStorage.setItem(TOKEN_NAME, token);
};

export const getLocalToken = () => {
  return window.localStorage.getItem(TOKEN_NAME);
};

export const removeLocalToken = () => {
  window.localStorage.removeItem(TOKEN_NAME);
};
