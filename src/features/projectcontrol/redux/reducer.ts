import { reducer as fetchProjectData } from './fetchProjectData';
import initialState, { IProjectControlInitState } from './initialState';
import { reducer as tabMgr } from './openTabs';
const reducers = [fetchProjectData, tabMgr];

export default function reducer(state: IProjectControlInitState = initialState, action: any) {
  let newState: IProjectControlInitState;
  switch (action.type) {
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
