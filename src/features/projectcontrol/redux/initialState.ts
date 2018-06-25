import { IProjectInfo } from '../../../common/types';

export interface IProjectControlInitState {
  fetchProjectDataStatus: string | null;
  projectInfo: IProjectInfo | undefined | null;
}

const initialState: IProjectControlInitState = {
  //项目信息加载状态
  fetchProjectDataStatus: null,
  //当前项目信息
  projectInfo: null
};

export default initialState;
