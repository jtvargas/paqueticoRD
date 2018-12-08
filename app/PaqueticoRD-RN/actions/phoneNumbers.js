export const GET_PHONE_NUMBERS = 'GET_PHONE_NUMBERS';

export const PHONE_NUMBERS_RESULT = 'PHONE_NUMBERS_RESULT';
export const PHONE_NUMBERS_ERROR = 'PHONE_NUMBERS_ERROR';

export const SELECT_NUMBER = 'SELECT_NUMBER';

export const getPhoneNumbers = (token) => ({
    type: GET_PHONE_NUMBERS,
    token,
    success: PHONE_NUMBERS_RESULT,
    error: PHONE_NUMBERS_ERROR
});

export const selectNumber = (number) => ({
    type: SELECT_NUMBER,
    number
})