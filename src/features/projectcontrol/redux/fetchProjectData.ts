import axios from 'axios';
import { Dispatch } from 'redux';
import { IProjectInfo } from '../../../common/types';
import initialState, { IProjectControlInitState } from './initialState';
import { FETCH_PROJECT_DATA_BEGIN, FETCH_PROJECT_DATA_SUCCESS, FETCH_PROJECT_DATA_FAILURE } from './constants';
import { getOpenTabs } from './openTabs';

export function fetchProjectData(id: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: FETCH_PROJECT_DATA_BEGIN
    });
    return new Promise((resolve, reject) => {
      let url = `/projects/${id}`;
      axios.get(url).then(
        res => {
          res.data.__id = id;
          dispatch({
            type: FETCH_PROJECT_DATA_SUCCESS,
            data: res.data
          });
          resolve(res.data);
        },
        err => {
          dispatch({
            type: FETCH_PROJECT_DATA_FAILURE,
            data: { error: err }
          });
          reject(err);
        }
      );
    });
  };
}

export function reducer(state: IProjectControlInitState = initialState, action: any) {
  switch (action.type) {
    case FETCH_PROJECT_DATA_BEGIN:
      return {
        ...state,
        projectInfoFetchState: FETCH_PROJECT_DATA_BEGIN
      };

    case FETCH_PROJECT_DATA_SUCCESS: {
      return {
        ...state,
        projectInfoFetchState: FETCH_PROJECT_DATA_SUCCESS,
        projectInfo: action.data as IProjectInfo,
        openTabs: getOpenTabs((action.data as any).__id),
        pageInfoFetchState: null,
        pageInfo: null,
        pageOutline: null,
        componentPropsInfo: null
      };
    }
    case FETCH_PROJECT_DATA_FAILURE: {
      return {
        ...state,
        projectInfoFetchState: FETCH_PROJECT_DATA_FAILURE
      };
    }
    default:
      return state;
  }
}
