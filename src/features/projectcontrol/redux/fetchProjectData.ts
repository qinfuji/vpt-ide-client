import axios from 'axios';
import { Dispatch } from 'redux';
import { IProjectInfo } from '../../../common/types';
import initialState, { IProjectControlInitState } from './initialState';

export enum FetchProjectDataStatus {
  FETCH_PROJECT_DATA_BEGIN = 'FETCH_PROJECT_DATA_BEGIN',
  FETCH_PROJECT_DATA_SUCCESS = 'FETCH_PROJECT_DATA_SUCCESS',
  FETCH_PROJECT_DATA_FAILURE = 'FETCH_PROJECT_DATA_FAILURE'
}

export { IProjectInfo } from '../../../common/types';

export function fetchProjectData(id: string) {
  return (dispatch: Dispatch) => {
    dispatch({
      type: FetchProjectDataStatus.FETCH_PROJECT_DATA_BEGIN
    });
    return new Promise((resolve, reject) => {
      console.log('start fetchProjectData');
      let url = `/projects/${id}`;
      axios.get(url).then(
        res => {
          dispatch({
            type: FetchProjectDataStatus.FETCH_PROJECT_DATA_SUCCESS,
            data: res.data
          });
          resolve(res.data);
        },
        err => {
          dispatch({
            type: FetchProjectDataStatus.FETCH_PROJECT_DATA_FAILURE,
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
    case FetchProjectDataStatus.FETCH_PROJECT_DATA_BEGIN:
      return {
        ...state,
        projectInfoFetchState: FetchProjectDataStatus.FETCH_PROJECT_DATA_BEGIN
      };

    case FetchProjectDataStatus.FETCH_PROJECT_DATA_SUCCESS: {
      return {
        ...state,
        projectInfoFetchState: FetchProjectDataStatus.FETCH_PROJECT_DATA_SUCCESS,
        projectInfo: action.data as IProjectInfo,
        pageInfoFetchState: null,
        pageInfo: null,
        pageOutline: null,
        componentPropsInfo: null
      };
    }
    case FetchProjectDataStatus.FETCH_PROJECT_DATA_FAILURE: {
      return {
        ...state,
        projectInfoFetchState: FetchProjectDataStatus.FETCH_PROJECT_DATA_FAILURE
      };
    }
    default:
      return state;
  }
}
