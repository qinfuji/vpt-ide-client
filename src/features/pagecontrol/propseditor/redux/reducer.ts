import { reducer as fetchComponentEditInfo } from './fetchComponentEditInfo';
import initialState, { IPropertyEditorInitialState } from './initialState';

const reducers = [fetchComponentEditInfo];

export default function reducer(state: IPropertyEditorInitialState = initialState, action: any) {
  let newState: IPropertyEditorInitialState;
  switch (action.type) {
    default:
      newState = state;
      break;
  }
  return reducers.reduce((s, r) => r(s, action), newState);
}
