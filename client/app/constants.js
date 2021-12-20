export const BASE_API_URL = process.env.BASE_API_URL;

export const SOCKET_URL =
  window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:3000'
    : window.location.host;

export const ROLE_ADMIN = 'ROLE_ADMIN';
