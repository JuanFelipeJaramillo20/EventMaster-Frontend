export const setLocalToken = (token: string) => {
  if (!token) return;
  window.localStorage.setItem('token', token);
};

export const getLocalToken = () => {
  return window.localStorage.getItem('token');
};
