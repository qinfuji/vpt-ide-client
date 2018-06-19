import { IProjectBaseInfo } from '../../../common/types';

export interface ISelectProjectInitState {
  showme: boolean;
  fetchProjectsStatus: string | null | undefined;
  projects: IProjectBaseInfo[] | null;
}

const initialState: ISelectProjectInitState = {
  showme: false, //是否显示
  fetchProjectsStatus: null, //项目加载状态
  projects: null //获取的项目列表
};

export default initialState;
