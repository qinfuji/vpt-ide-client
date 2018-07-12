import { IFile } from '../../../common/types';
import { Dispatch } from 'redux';
import initialState, { IProjectControlState } from './initialState';
import { SessionStorage } from '../../../utilities';
import { CHANGE_TABS } from './constants';
import OpenFileTabs from '../OpenFileTabs';

export function getOpenedFiles(projectId: string): IFile[] {
  return JSON.parse(SessionStorage.getItem(projectId + '_OpenedFiles') || '[]');
}

export function getActivedFile(projectId: string) {
  let activedFile = SessionStorage.getItem(projectId + '_ActivedFile');
  return activedFile ? JSON.parse(activedFile) : null;
}

/**
 * 关闭tab
 */
function resetFiles(projectId: string, openedFiles: IFile[], activedFile: IFile | null) {
  return (dispatch: Dispatch) => {
    SessionStorage.setItem(projectId + '_OpenedFiles', JSON.stringify(openedFiles));
    if (activedFile != null) {
      SessionStorage.setItem(projectId + '_ActivedFile', JSON.stringify(activedFile));
    } else {
      SessionStorage.removeItem(projectId + '_ActivedFile');
    }

    dispatch({
      type: CHANGE_TABS,
      data: projectId
    });
  };
}

export function closeFile(projectId: string, closeFile: IFile) {
  return (dispatch: Dispatch) => {
    let openedFiles = getOpenedFiles(projectId);
    if (openedFiles.length == 0) {
      return resetFiles(projectId, [], null);
    }
    let closeIndex = -1;
    for (let index = 0; index < openedFiles.length; index++) {
      const element = openedFiles[index];
      if (element.path == closeFile.path) {
        closeIndex = index;
        break;
      }
    }
    if (closeIndex < 0) {
      return resetFiles(projectId, openedFiles, null)(dispatch);
    }
    openedFiles.splice(closeIndex, 1);
    let newlen = openedFiles.length;

    if (newlen > 0 && closeIndex == 0) {
      return resetFiles(projectId, openedFiles, openedFiles[0])(dispatch);
    } else if (newlen > 0 && closeIndex == newlen) {
      return resetFiles(projectId, openedFiles, openedFiles[newlen - 1])(dispatch);
    } else {
      return resetFiles(projectId, openedFiles, openedFiles[closeIndex])(dispatch);
    }
  };
}

/**
 * 选择新的tab
 */
export function activeFile(projectId: string, activeFile: IFile) {
  return (dispatch: Dispatch) => {
    let openedFiles = getOpenedFiles(projectId);
    if (openedFiles.length == 0) {
      return resetFiles(projectId, [activeFile], activeFile)(dispatch);
    }
    let isExist = false;
    for (let index = 0; index < openedFiles.length; index++) {
      const element = openedFiles[index];
      if (element.path === activeFile.path) {
        openedFiles[index] = activeFile;
        isExist = true;
        break;
      }
    }
    if (!isExist) {
      openedFiles.push(activeFile);
    }
    return resetFiles(projectId, openedFiles, activeFile)(dispatch);
  };
}

export function reducer(state: IProjectControlState = initialState, action: any) {
  switch (action.type) {
    case CHANGE_TABS: {
      return {
        ...state,
        openedFiles: getOpenedFiles(action.data),
        activedFile: getActivedFile(action.data)
      };
    }
    default:
      return state;
  }
}
