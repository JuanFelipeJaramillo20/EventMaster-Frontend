import { USER_ID } from '../constants/constants';

export const setUserID = (userID: number) => {
  console.log("id", userID)
  if (!userID) return;
  window.localStorage.setItem(USER_ID, `${userID}`);
};

export const getUserID = () => window.localStorage.getItem(USER_ID);

export const removeUserID = () => {
  window.localStorage.removeItem(USER_ID);
};
