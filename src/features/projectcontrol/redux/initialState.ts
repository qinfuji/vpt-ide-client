import { IProjectInfo, IFile } from '../../../common/types';

export interface IProjectControlInitState {
  //获取项目数据的状态
  fetchProjectDataStatus: string | null;
  //项目信息
  projectInfo: IProjectInfo | undefined | null;
  //当前项目打来的文件
  openTabs: IFile[] | null | undefined;
  //当前活动的文件
  activeTab: IFile | null | undefined;
}

const initialState: IProjectControlInitState = {
  //项目信息加载状态
  fetchProjectDataStatus: null,
  //当前项目信息
  projectInfo: null,

  openTabs: null,

  activeTab: null
};

export default initialState;
