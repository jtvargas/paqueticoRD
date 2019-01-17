import { takeEvery, select, call, put, take } from 'redux-saga/effects';

/*
AQUI SE MANEJA LA CONECCION CON EL SERVIDOR/API

  MODULOS TRABAJADOS:
    *AUTENTICACION
      -LOGIN
    
    *RECARGA
      -GET CONTRACTS
      -POST ORDER

  Las funciones estaran separadas por Modulos y Acciones para mejor entendimiento.
*/


// Acciones para el LOGIN
import {
  AUTHENTICATE_USER
} from '../actions/user';

// Acciones para los contratos
import {
    GET_PHONE_NUMBERS
} from '../actions/phoneNumbers';

// Acciones para colocar la Orden
import {
  PLACE_ORDER,
  GET_METHODS_PAYMENTS,
  METHODS_RESULT,
  METHODS_ERROR,
  ADD_CREDIT_CARD
} from '../actions/payment';


// CONSTANTES
const COMPANY_ID = '5bf74c5ab180814429f32e3b';
const API_URL = 'http://10.0.0.8:3000' //'http://172.20.10.2:3000'; //'http://127.0.0.1:3000'

// FETCH POST METHOD
const postData = (url, params, token) =>
  fetch(url, {
    method: 'POST',
    headers: {
      Authorization: "Bearer "+token,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

// FETCH GET
const getData = (url, token) =>
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: "Bearer "+token,
    },
  });

// FUNCION PARA AUTENTICAR Y OBTENER LA INFORMACION PERSONAL DEL USUARIO
const fetchUserInfo = function* (action) {
  console.log(`[SAGAS] fetching user's personal info from server...`);
  try {
    let params = {
	    email: action.user,
	    password: action.pass,
	    companyId: COMPANY_ID
    }
    const response = yield call(postData, API_URL+"/auth", params);
    const result = yield response.json();
    //console.log(`[SAGAS] server response`, response);
    if(result.success)
    {
        yield put({ 
            type: action.success,
            userEmail: result.user.email,
            userId: result.user.id,
            token: result.token,
            name: result.user.name,
            image: result.user.imageUrl });
    }
    else
    {
        yield put({ type: action.error, error: result.msg });
    }
    
  } catch (e) {
    console.log(e);
    yield put({ type: action.error, error: 'Error en la Authenticacion' });
  }
};

// FUNCION PARA OBTENER LOS CONTRATOS DEL USUARIO
const fetchPhoneNumbers = function* (action) {
  console.log(`[SAGAS] fetching user's phone numbers from server...`);
    try {
      let token = action.token;
      console.log(`[SAGAS] token: ${token}`);

      const response = yield call(getData, API_URL+"/recarga/contracts", token);
      console.log("Bearer "+token);
      const result = yield response.json();
      
      console.log(`[SAGAS] server response`, response);
      if(result.success)
      {
          yield put({ type: action.success, phoneNumbers: result.contracts });
      }
      else
      {
          yield put({ type: action.error, error: result.msg });
      }
      
    } catch (e) {
      console.log(e);
      yield put({ type: action.error, error: 'Error en la toma de los numeros de telefono' });
    }
  };

// FUNCION PARA OBTENER LOS METODOS DE PAGO DEL USUARIO
const fetchPaymentsMethods = function* (action) {
  console.log(`[SAGAS] fetching payment methods from server...`);
  try {
    let token = action.token;
    console.log(`[SAGAS] token: ${token}`);

    const response = yield call(getData, API_URL + "/payments", token);
    const result = yield response.json();

    console.log(`[SAGAS] server response`, response);
    if (result.success) {
      yield put({ type: METHODS_RESULT, methods: result.results });
    }
    else {
      yield put({ type: METHODS_ERROR, error: result.msg });
    }

  } catch (e) {
    console.log(e);
    yield put({ type: METHODS_ERROR, error: 'Error en la toma de los metodos de pago' });
  }
};

  // FUNCION PARA COLOCAR LA ORDEN DE RECARGA
  const postOrderData = function* (action) {
    console.log(`[SAGAS] placing order on server...`);
    try {
      let token = action.token;
      let params = {
        "type": action.orderType,
        "amount": action.amount,
        "paymentMethodId": action.paymentMethodId,
        "contractId": action.contractId
      };
      console.log(`[SAGAS] token: ${token}`);
      console.log(`[SAGAS] order params`, params);

      const response = yield call(postData, API_URL+"/recarga", params, token);
      const result = yield response.json();
      console.log(`[SAGAS] order response`, response);
      if(result.success)
      {
          yield put({ type: action.success, message: result.msg });
      }
      else
      {
          yield put({ type: action.error, error: result.msg });
      }
      
    } catch (e) {
      console.log(e);
      yield put({ type: action.error, error: 'Error en la recarga' });
    }
  };

  // FUNCION PARA AGREGAR TARJETA
  const postCreditCard = function* (action) {
    console.log(`[SAGAS] adding credit card on server...`);
    try {
      let token = action.token;
      let params = action.creditCard;
      console.log(`[SAGAS] token: ${token}`);
      console.log(`[SAGAS] order params`, params);

      const response = yield call(postData, API_URL+"/payments", params, token);
      const result = yield response.json();
      console.log(`[SAGAS] order response`, response);
      if(result.success)
      {
          yield put({ type: GET_METHODS_PAYMENTS, token: token });
      }
      else
      {
        alert(result.msg);
          //yield put({ type: action.error, error: result.msg });
      }
      
    } catch (e) {
      console.log(e);
      alert(e);
      //yield put({ type: action.error, error: 'Error en la recarga' });
    }
  };

const rootSaga = function* rootSaga() {
  yield takeEvery(AUTHENTICATE_USER, fetchUserInfo);
  yield takeEvery(GET_PHONE_NUMBERS, fetchPhoneNumbers);
  yield takeEvery(GET_PHONE_NUMBERS, fetchPaymentsMethods);
  yield takeEvery(GET_METHODS_PAYMENTS, fetchPaymentsMethods);
  yield takeEvery(PLACE_ORDER, postOrderData);
  yield takeEvery(ADD_CREDIT_CARD, postCreditCard);
};

export default rootSaga;
