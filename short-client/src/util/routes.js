export const HOME = '/';
export const APP_LOGIN = '/app/login';
export const APP_SIGNUP = '/app/signup';
export const SHORT = /^(\/[a-zA-Z0-9_-]+)(\+?)$/;

export const checkTokenExpr = (err) => {
  if (err && err.response && err.response.data && err.response.data.code === 'auth/id-token-expired') window.location.assign(APP_LOGIN)
};
