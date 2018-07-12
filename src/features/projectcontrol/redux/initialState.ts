import { IProjectInfo, IFile } from '../../../common/types';

export interface IProjectControlState {
  //获取项目数据的状态
  fetchProjectDataStatus: string | null;
  //项目信息
  projectInfo: IProjectInfo | undefined | null;
  //当前项目打来的文件
  openedFiles: IFile[] | null | undefined;
  //当前活动的文件
  activedFile: IFile | null | undefined;
}

const initialState: IProjectControlState = {
  //项目信息加载状态
  fetchProjectDataStatus: null,
  //当前项目信息
  projectInfo: null,

  openedFiles: null,

  activedFile: null
};

export default initialState;
