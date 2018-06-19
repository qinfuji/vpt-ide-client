//import _ from 'lodash';
import initialState from './initialState';

const reducers = [];

export default function reducer(state = initialState, action) {
  return reducers.reduce((s, r) => r(s, action), state);
}
