//import axios from 'axios';
import { Dispatch } from 'redux';
import { IPropertyEditInfo, IPropertyType, IPropertyCategroy } from '../../../../common/types';
import { FETCH_COMPONENT_EDIT_INFO } from './constants';
import initialState, { IPropertyEditorInitialState } from './initialState';

export function fetchComponentEditInfo(node: any) {
  let props = node.get('props');
  let context = node.get('context');
  let key = node.get('key');
  let name = node.get('name');
  let nodeType = node.get('nodeType');
  //console.log(props, context, key, name, nodeType);
  return (dispatch: Dispatch) => {
    dispatch({
      type: FETCH_COMPONENT_EDIT_INFO,
      data: [
        {
          name: 'label',
          type: IPropertyType.STRING,
          category: IPropertyCategroy.PROPERTY,
          defaultValue: 'aaaa'
        }
      ] as IPropertyEditInfo[]
    });
  };
}

export function reducer(state: IPropertyEditorInitialState = initialState, action: any) {
  switch (action.type) {
    case FETCH_COMPONENT_EDIT_INFO: {
      return {
        ...state,
        propsEditInfo: action.data as IPropertyEditInfo[]
      } as IPropertyEditorInitialState;
    }
    default: {
      return state;
    }
  }
}
