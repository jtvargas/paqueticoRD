import {METHODS_RESULT, METHODS_ERROR} from '../actions/payment';
  
  const initialState = {
    done: false,
    paymentMethods: [],
    error: null
  };
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case METHODS_RESULT:
        return {
            done: true,
            paymentMethods: action.methods,
            error: null
        };
      case METHODS_ERROR:
        return {
            done: false,
            paymentMethods: [],
            error: action.error
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  