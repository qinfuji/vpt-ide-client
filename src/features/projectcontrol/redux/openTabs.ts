import { IFile } from '../../../common/types';
import { Dispatch } from 'redux';
import initialState, { IProjectControlInitState } from './initialState';
import { SessionStorage } from '../../../utilities';
import { CHANGE_TABS } from './constants';
import OpenFileTabs from '../OpenFileTabs';

export function getOpenTabs(projectId: string): IFile[] {
  return JSON.parse(SessionStorage.getItem(projectId + '_OpenTabs') || '[]');
}

export function getActiveTab(projectId: string) {
  let activeTab = SessionStorage.getItem(projectId + '_ActiveTab');
  return activeTab ? JSON.parse(activeTab) : null;
}

/**
 * 关闭tab
 */
function resetTabs(projectId: string, openTabs: IFile[], activeTab: IFile | null) {
  return (dispatch: Dispatch) => {
    SessionStorage.setItem(projectId + '_OpenTabs', JSON.stringify(openTabs));
    if (activeTab != null) {
      SessionStorage.setItem(projectId + '_ActiveTab', JSON.stringify(activeTab));
    } else {
      SessionStorage.removeItem(projectId + '_ActiveTab');
    }

    dispatch({
      type: CHANGE_TABS,
      data: projectId
    });
  };
}

export function closeTab(projectId: string, closedTab: IFile) {
  return (dispatch: Dispatch) => {
    let openTabs = getOpenTabs(projectId);
    if (openTabs.length == 0) {
      return resetTabs(projectId, [], null);
    }
    let closeIndex = -1;
    for (let index = 0; index < openTabs.length; index++) {
      const element = openTabs[index];
      if (element.path == closedTab.path) {
        closeIndex = index;
        break;
      }
    }
    if (closeIndex < 0) {
      return resetTabs(projectId, openTabs, null)(dispatch);
    }

    openTabs.splice(closeIndex, 1);
    let newlen = OpenFileTabs.length;

    if (newlen > 0 && closeIndex == 0) {
      return resetTabs(projectId, openTabs, openTabs[0])(dispatch);
    } else if (newlen > 0 && closeIndex == newlen) {
      return resetTabs(projectId, openTabs, openTabs[newlen - 1])(dispatch);
    } else {
      return resetTabs(projectId, openTabs, openTabs[closeIndex])(dispatch);
    }
  };
}

/**
 * 选择新的tab
 */
export function activeTab(projectId: string, activeTab: IFile) {
  return (dispatch: Dispatch) => {
    let openTabs = getOpenTabs(projectId);
    if (openTabs.length == 0) {
      return resetTabs(projectId, [activeTab], activeTab)(dispatch);
    }
    let isExist = false;
    for (let index = 0; index < openTabs.length; index++) {
      const element = openTabs[index];
      if (element.path === activeTab.path) {
        openTabs[index] = activeTab;
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      openTabs.push(activeTab);
    }
    return resetTabs(projectId, openTabs, activeTab)(dispatch);
  };
}

export function reducer(state: IProjectControlInitState = initialState, action: any) {
  switch (action.type) {
    case CHANGE_TABS: {
      return {
        ...state,
        openTabs: getOpenTabs(action.data),
        activeTab: getActiveTab(action.data)
      };
    }
    default:
      return state;
  }
}
