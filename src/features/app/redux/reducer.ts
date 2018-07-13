import { combineReducers } from 'redux';
import { reducer as login } from './login';
import { reducer as setUser } from './setUser';

const reducerMap = {
  loginState: login,
  userInfo: setUser
};

let reducer = combineReducers(reducerMap);
export default reducer;
