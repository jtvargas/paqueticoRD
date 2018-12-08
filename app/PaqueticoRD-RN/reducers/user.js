import {AUTHENTICATION_RESULT, AUTHENTICATION_ERROR} from '../actions/user';
  
  const initialState = {
    done: false,
    id: null,
    email: "",
    company: "",
    token: null,
    name: "",
    image: null,
    error: null
  };

  const offlineUser = {
    done: true,
    id: 1070949,
    email: "carg1975@hotmail.com",
    company: "Claro",
    token: 1992211,
    name: "Carlos Rosario",
    image: null,
    error: null
  }
  
  const reducer = (state = initialState, action) => {
    switch (action.type) {
      case AUTHENTICATION_RESULT:
        return {
            done: true,
            id: action.userId,
            email: action.userEmail,
            company: action.company,
            token: action.token,
            name: action.name,
            image: action.image,
            error: null
        };
      case AUTHENTICATION_ERROR:
        return {
            ...state,
            done: false,
            error: action.error
        };
      default:
        return state;
    }
  };
  
  export default reducer;
  