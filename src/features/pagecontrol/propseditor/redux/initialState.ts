import { IPropertyEditInfo } from '../../../../common/types';
export type IPropertyEditorInitialState = {
  editInfo: IPropertyEditInfo[] | null;
};

const initialState: IPropertyEditorInitialState = {
  editInfo: null
};

export default initialState;
