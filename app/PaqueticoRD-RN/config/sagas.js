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
  PLACE_ORDER
} from '../actions/payment';


// CONSTANTES
const COMPANY_ID = '5bf74c5ab180814429f32e3b';
const API_URL = 'http://192.168.1.111:3000'

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
    console.log(`[SAGAS] server response`, response);
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

const rootSaga = function* rootSaga() {
  yield takeEvery(AUTHENTICATE_USER, fetchUserInfo);
  yield takeEvery(GET_PHONE_NUMBERS, fetchPhoneNumbers);
  yield takeEvery(PLACE_ORDER, postOrderData);
};

export default rootSaga;