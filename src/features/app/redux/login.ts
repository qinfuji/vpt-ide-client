import axios from 'axios';
import cookies from 'js-cookie';
import { Dispatch } from 'react-redux';
import { LOGIN_BEGIN, LOGIN_FAILURE, SET_USER_INFO } from './constants';

export function login(username: string, password: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: LOGIN_BEGIN,
      data: {}
    });
    return new Promise((resolve, reject) => {
      axios
        .post('/login', {
          username: username,
          password: password
        })
        .then(
          res => {
            resolve(res.data);
            let userInfo = cookies.get('userInfo');
            let user = userInfo ? JSON.parse(userInfo) : null;
            dispatch({
              type: SET_USER_INFO,
              data: user
            });
          },
          err => {
            reject(err);
            dispatch({
              type: LOGIN_FAILURE,
              data: { err: err }
            });
          }
        );
    });
  };
}

const initialState = {
  loginStatus: null
};

export function reducer(state = { loginStatus: initialState }, action: any) {
  switch (action.type) {
    case LOGIN_BEGIN: {
      return { ...state, loginStatus: { status: LOGIN_BEGIN } };
    }
    case LOGIN_FAILURE: {
      return {
        ...state,
        loginStatus: { status: LOGIN_FAILURE, data: action.err }
      };
    }
    default:
      return state;
  }
}
