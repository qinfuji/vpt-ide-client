import { SET_USER_INFO } from './constants';

import { Dispatch } from 'redux';
const Cookies = require('js-cookie');
export interface UserInfo {
  userName: string;
}

export function setUser(userInfo: UserInfo) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: SET_USER_INFO,
      data: userInfo
    });
  };
}

let _userInfo: string | undefined = Cookies.get('userInfo');
const userInfo: UserInfo = _userInfo ? JSON.parse(_userInfo) : null;

export function reducer(state = { userInfo }, action: any) {
  switch (action.type) {
    case SET_USER_INFO: {
      return action.data;
    }
    default:
      return state;
  }
}
