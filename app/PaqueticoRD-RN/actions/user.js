export const AUTHENTICATE_USER = 'AUTHENTICATE_USER';

export const AUTHENTICATION_RESULT = 'AUTHENTICATION_RESULT';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';

export const authenticateUser = (user, pass) => ({
    type: AUTHENTICATE_USER,
    user,
    pass,
    success: AUTHENTICATION_RESULT,
    error: AUTHENTICATION_ERROR
});