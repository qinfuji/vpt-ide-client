import { reducer as fetchProjectData } from './fetchProjectData';
import initialState, { IProjectControlInitState } from './initialState';
const reducers = [fetchProjectData];

export default function reducer(state: IProjectControlInitState = initialState, action: any) {
  let newState: IProjectControlInitState;
  switch (action.type) {
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
