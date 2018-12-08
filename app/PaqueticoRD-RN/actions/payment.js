export const PLACE_ORDER = "PLACE_ORDER";
export const ORDER_RESULT = "ORDER_RESULT";
export const ORDER_ERROR = "ORDER_ERROR";

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