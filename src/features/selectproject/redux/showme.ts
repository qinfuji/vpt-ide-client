import { Dispatch } from 'redux';
import { OPEN_SELECT_PROJECTS } from './constants';
import initialState, { ISelectProjectInitState } from './initialState';

export function showme(hidden: boolean) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: OPEN_SELECT_PROJECTS,
      data: hidden
    });
  };
}

export function reducer(state: ISelectProjectInitState = initialState, action: any) {
  switch (action.type) {
    case OPEN_SELECT_PROJECTS: {
      return { ...state, showme: action.data };
    }
    default:
      return state;
  }
}
