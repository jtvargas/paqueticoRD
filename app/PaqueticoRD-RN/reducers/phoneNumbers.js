import {PHONE_NUMBERS_RESULT, PHONE_NUMBERS_ERROR, SELECT_NUMBER} from '../actions/phoneNumbers';
import {ORDER_RESULT} from '../actions/payment';
  
  const initialState = {
    done: false,
    phoneNumbers: [],
    selectedNumber: {},
    error: null
  };

  const offlineNumbers = {
    done: true,
    phoneNumbers: [
      {
        number: "809-732-0288",
        dataBalance: "50mb",
        voiceBalance: "100 minutos",
        id: 1
      },
      {
        number: "809-639-9234",
        dataBalance: "20mb",
        voiceBalance: "8 minutos",
        id: 2
      },
      {
        number: "809-555-7777",
        dataBalance: "12mb",
        voiceBalance: "300 minutos",
        id: 3
      }
    ],
    selectedNumber: {},
    error: null
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case PHONE_NUMBERS_RESULT:
        return {
            ...state,
            done: true,
            phoneNumbers: action.phoneNumbers,
            error: null
        };
      case PHONE_NUMBERS_ERROR:
        return {
            ...state,
            done: false,
            error: action.error
        };
      case SELECT_NUMBER:
        return {
            ...state,
            selectedNumber: action.number
        }
      case ORDER_RESULT:
        return {
          ...state,
          selectedNumber: {}
        }
      default:
        return state;
    }
  };
  
  export default reducer;
  