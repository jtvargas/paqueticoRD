export const PLACE_ORDER = "PLACE_ORDER";
export const ORDER_RESULT = "ORDER_RESULT";
export const ORDER_ERROR = "ORDER_ERROR";

export const GET_METHODS_PAYMENTS = "GET_METHODS_PAYMENTS";
export const METHODS_RESULT = "METHODS_RESULT";
export const METHODS_ERROR = "METHODS_ERROR";

export const ADD_CREDIT_CARD = "ADD_CREDIT_CARD"

export const placeOrder = (orderType, amount, paymentMethodId, contractId, token) => ({
    type: PLACE_ORDER,
    token,
    orderType,
    amount,
    paymentMethodId,
    contractId,
    success: ORDER_RESULT,
    error: ORDER_ERROR
})

export const getPaymentMethods = (token) => ({
    type: GET_METHODS_PAYMENTS,
    token,
    success: METHODS_RESULT,
    error: METHODS_ERROR
})

export const addCreditCard = (creditCard, token) => ({
    type: ADD_CREDIT_CARD,
    token,
    creditCard
})