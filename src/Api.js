import { CONFIG_BACKEND } from './config';

const getRequest = async (endpoint) => {
  const fetcher = await fetch(endpoint);
  return fetcher.json();
};

const postRequest = async (endpoint, body) => {
  const fetcher = await fetch(endpoint, {
    method: 'POST',
    body: Object.entries(body).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&'),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return fetcher.json();
};

export const apiAddUser = (userId) => {
  return postRequest(CONFIG_BACKEND + '/add-user', { userId });
};

export const apiGetState = (userId) => {
  return getRequest(CONFIG_BACKEND + '/my-state?userId=' + userId);
};
