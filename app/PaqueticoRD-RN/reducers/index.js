import { combineReducers } from 'redux';

import user from './user';
import phoneNumbers from './phoneNumbers';
import cart from './cart';

export default combineReducers({
  user,
  phoneNumbers,
  cart
});
