import { IStyle, ITheme } from 'office-ui-fabric-react/lib/Styling';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
export interface ITree {}

export interface ITreeItem {
  children?: ITreeItem[];
  [key: string]: any;
  isCollapse?: boolean;
}

export enum TreeSelectMode {
  'None',
  'Single',
  'Multi'
}

export interface ITreeProps {
  items?: ITreeItem[];
  getChildren?: (item: ITreeItem) => ITreeItem[] | null;
  componentRef?: (ref: ITree | null) => void | ITree;
  onRenderItem: (item: ITreeItem) => React.ReactNode;
  initialSelectedKey?: string;
  selectedKey?: string;
  className?: string;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<ITreeStyleProps, ITreeStyles>;
  visualCheckbox?: boolean;
  selectMode?: TreeSelectMode;
  onSelectChange?: (items: ITreeItem[] | ITreeItem) => void;
  onClick?: (item: ITreeItem) => void;
  onInvoke?: (item: ITreeItem) => void;
}

export interface ITreeStyleProps {
  theme: ITheme;
  className?: string;
}

export interface ITreeStyles {
  root: IStyle;
  treeNode: IStyle;
  treeGroup: IStyle;
}
