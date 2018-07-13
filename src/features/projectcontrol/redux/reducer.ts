import { combineReducers } from 'redux';
import { reducer as fetchProjectData } from './fetchProjectData';
import initialState, { IProjectControlState } from './initialState';
import { reducer as tabMgr } from './openFiles';
import pageControlReducer from '../../pagecontrol/redux/reducer';

const reducers = [fetchProjectData, tabMgr, pageControlReducer];

export default function reducer(state: IProjectControlState = initialState, action: any) {
  let newState: IProjectControlState;
  switch (action.type) {
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
