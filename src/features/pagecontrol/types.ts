//编辑属性，事件、布局

export enum IEditPropertyCategroy {
  'Property',
  'Event',
  'Layout',
  'Styles'
}

/**组件可编辑属性 */
export interface IEditorProperty {
  /** 属性名称 */
  name: string;
  /**属性显示 */
  label: string;
  /** 属性类型*/
  type: string;
  /** 属性分类 */
  categroy: IEditPropertyCategroy;
  /**属性分组 */
  group: string;
}

export enum IPageOutlineItemType {
  NORMAL = 'normal',
  CONTAINER = 'container'
}

/** 组件结构 */
export interface IPageOutlineItem {
  /**
   * 组件id
   */
  id: string;
  /**
   * 组件名称
   */
  name: string;
  /**
   * 组件类型 . CONTAINER , NORMAL
   */
  type: IPageOutlineItemType;
  /**
   * 父组件id
   */
  parent: string | null;
}

export interface ICodeOutlineItem {
  id: string;
  /** token name */
  name: string;
  /**js token类型 */
  type: string;
  /** 行号 */
  lineNo: number;
  /** parent */
  parent: ICodeOutlineItem | null;
}
