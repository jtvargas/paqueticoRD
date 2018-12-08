import {ORDER_RESULT, ORDER_ERROR} from '../actions/payment';
  
  const initialState = {
    done: false,
    cart: {},
    message: "",
    error: ""
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case ORDER_RESULT:
        return {
            done: true,
            cart: {},
            message: action.message,
            error: ""
        };
      case ORDER_ERROR:
        return {
            done: false,
            cart: {},
            message: "",
            error: action.error
        };
      default:
        return initialState;
    }
  };
  export default reducer;
  