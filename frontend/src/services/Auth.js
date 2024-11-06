/* eslint-disable no-useless-catch */
import axios from 'axios';
import { getApiCall, postApiCall } from '../utils/Api';

export const login = async ({ email, password }) => {
  const result = await postApiCall('/auth/login', { email, password });
  return result.data;
};

export const validateLoggedInUser = async () => {
  const options = {
    url: `${process.env.REACT_APP_API_ENDPOINT}/auth/validate-user`,
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    withCredentials: true,
    data: {},
  };

  try {
    const response = await axios(options);
    return response;
  } catch (e) {
    throw e;
  }
};

export const logOut = async () => {
  const result = await getApiCall('/auth/logout');
  return result.data;
};
