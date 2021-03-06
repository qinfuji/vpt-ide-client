export interface IProjectComponent {
  /**组件名称 */
  name: string;
  /**组件中文名 */
  label: string;
  /**组件id ， TODO 是否需要id？ */
  id: string;
  /** 描述 */
  descr?: string;
  /** 图标 */
  logo: string;

  key?: string;
}

export interface IProjectDependency {
  /** 模块名称*/
  name: string;
  /** 要求版本 */
  required: string;
  /**安装版本 */
  installed: string;
  /**最新版本 */
  latest: string;
  /**仓库地址 */
  repo: string;
}

export interface IProjectDependencies {
  dependencies: IProjectDependency[];
  devDependencies: IProjectDependency[];
}

export interface IProjectBaseInfo {
  /** 项目名称 */
  name: string;
  /** 项目标题 */
  label: string;
  /**项目 描述 */
  descr: string;
  /** 项目创建时间*/
  createDate: string;
  /**项目最后更新时间 */
  lastUpdateDate: string;

  key?: string;

  logo: string;

  id: string;
}

export enum IFileType {
  'PAGE',
  'DIR',
  'WIDGET',
  'DIALOG',
  'LIB',
  'DATA',
  'ACTION',
  'COMPONENT'
}

export interface IFile {
  id: string;
  /**名称 */
  name: string;
  /**显示名称 */
  label: string;
  /**子页面 ， 当是目录的情况下存在 */
  parent: string | null | undefined;
  /**路径 */
  path: string;
  /**文件类型 */
  type: IFileType;
  /**是否是首页 */
  isIndex?: boolean;

  isLeaf: boolean;
}

export enum LayoutType {
  'None',
  'LEFTRIGTH',
  'TOPBOTTOM'
}

export interface IProjectStructure {
  /** 项目页面 */
  pages: IFile[];
  /** 项目布局信息 */
  layouts: string;
  /**登录页 */
  login: string;
  /** 项目首页信息 */
  index: IFile;
  /** 错误页面 */
  errors: IFile[];
  /**通用文件 */
  commons: IFile[];
}

/**
 * 项目信息
 */
export interface IProjectInfo {
  /** 项目基本信息*/
  baseInfo: IProjectBaseInfo;
  /**可视化组件列表 */
  components: IProjectComponent[];
  /** 依赖列表 */
  dependencies: IProjectDependencies;
  /** 项目结构 */
  structure: IProjectStructure;
}
