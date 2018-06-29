import { IProjectInfo, IFile } from '../../../common/types';

export interface IProjectControlInitState {
  fetchProjectDataStatus: string | null;
  projectInfo: IProjectInfo | undefined | null;
  openTabs: IFile[] | null | undefined;
}

const initialState: IProjectControlInitState = {
  //项目信息加载状态
  fetchProjectDataStatus: null,
  //当前项目信息
  projectInfo: null,

  openTabs: null
};

export default initialState;
