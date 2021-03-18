import { CONFIG_BACKEND, CONFIG_HTTP_PORT, CONFIG_WS_PORT } from './config';

const getHttpUri = () => {
  return CONFIG_BACKEND + ([80, 443].includes(CONFIG_HTTP_PORT) ? '' : ':' + CONFIG_HTTP_PORT);
};

export const getWSUri = () => {
  return CONFIG_BACKEND + ([80, 443].includes(CONFIG_WS_PORT) ? '' : ':' + CONFIG_WS_PORT);
};

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
  return postRequest(getHttpUri() + '/add-user', { userId });
};

export const apiGetState = (userId) => {
  return getRequest(getHttpUri() + '/my-state?userId=' + userId);
};

export const apiSendMessage = (fromUserId, text) => {
  // TODO hashing!!!
  return postRequest(getHttpUri() + '/message', { fromUserId, text });
};

export const apiSendAction = (fromUserId, action, payload) => {
  return postRequest(getHttpUri() + '/action', { fromUserId, action, payload: JSON.stringify(payload) });
};