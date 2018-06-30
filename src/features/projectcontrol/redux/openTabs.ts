import { IFile } from '../../../common/types';
import { Dispatch } from 'redux';
import initialState, { IProjectControlInitState } from './initialState';
import { SessionStorage } from '../../../utilities';
import { RESET_TABS, ACTIVE_TAB } from './constants';

export function getOpenTabs(projectId: string) {
  return JSON.parse(SessionStorage.getItem(projectId + '_opentabs') || '[]');
}

export function getActiveTab(projectId: string) {
  let activeTab = SessionStorage.getItem(projectId + '_Active');
  return activeTab ? JSON.parse(activeTab) : null;
}

/**
 * 关闭tab
 */
export function resetTabs(projectId: string, openTabs: IFile[], activeTab: IFile) {
  return (dispatch: Dispatch) => {
    SessionStorage.setItem(projectId + '_opentabs', JSON.stringify(openTabs));
    SessionStorage.setItem(projectId + '_Active', JSON.stringify(activeTab));
    dispatch({
      type: RESET_TABS,
      data: projectId
    });
  };
}

/**
 * 选择新的tab
 */
export function activeTab(projectId: string, activeTab: IFile) {
  return (dispatch: Dispatch) => {
    SessionStorage.setItem(projectId + '_Active', JSON.stringify(activeTab));
    dispatch({
      type: ACTIVE_TAB,
      data: projectId
    });
  };
}

export function reducer(state: IProjectControlInitState = initialState, action: any) {
  switch (action.type) {
    case RESET_TABS: {
      return {
        ...state,
        openTabs: getOpenTabs(action.data),
        activeTab: getActiveTab(action.data)
      };
    }
    case ACTIVE_TAB: {
      return {
        ...state,
        activeTab: getActiveTab(action.data)
      };
    }
  }
}
