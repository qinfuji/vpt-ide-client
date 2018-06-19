export interface UserInfo {
  userName: string;
}

import cookies from 'js-cookie';

const _userInfo = cookies.get('UserInfo');
const userInfo: UserInfo = _userInfo ? JSON.parse(_userInfo) : null;
const initialState = {
  userInfo: userInfo
};

export default initialState;
