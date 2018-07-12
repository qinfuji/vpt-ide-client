import { reducer as fetchProjectData } from './fetchProjectData';
import initialState, { IProjectControlState } from './initialState';
import { reducer as tabMgr } from './openFiles';
const reducers = [fetchProjectData, tabMgr];

export default function reducer(state: IProjectControlState = initialState, action: any) {
  let newState: IProjectControlState;
  switch (action.type) {
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
