//import _ from 'lodash';
import { combineReducers } from 'redux';
import initialState from './initialState';
import propsEditReducer from '../propseditor/redux/reducer';
const reducers = [propsEditReducer];

export default function reducer(state = initialState, action) {
  return reducers.reduce((s, r) => r(s, action), state);
}
