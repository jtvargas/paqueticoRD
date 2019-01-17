import { combineReducers } from 'redux';

import user from './user';
import phoneNumbers from './phoneNumbers';
import cart from './cart';
import paymentMethods from './paymentMethods';

export default combineReducers({
  user,
  phoneNumbers,
  cart,
  paymentMethods
});
