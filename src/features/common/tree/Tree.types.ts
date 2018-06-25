import { IStyle, ITheme } from 'office-ui-fabric-react/lib/Styling';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';
import { SelectionMode } from 'office-ui-fabric-react/lib/Selection';
export interface ITree {}

export interface ITreeItem {
  [key: string]: any;
}

export interface ITreeMode<T extends ITreeItem> {
  isLeaf: (item: T) => boolean;
  getItem: (index: number) => ITreeItem;
  getItemIndex: (item: T) => number;
  getRoot: () => T[];
  getChild: (parent: T) => T[];
  isExpanded: (item: T) => boolean;
  setItems: (items: ITreeItem[]) => void;
  getId: (item: ITreeItem) => string | number;
}

export interface ITreeProps {
  items: ITreeItem[];
  getMode?: () => ITreeMode<ITreeItem>;
  componentRef?: (ref: ITree | null) => void | ITree;
  onRenderItem: (item: ITreeItem) => React.ReactNode;
  initialSelectedKey?: string;
  selectedKey?: string;
  className?: string;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<ITreeStyleProps, ITreeStyles>;
  visualCheckbox?: boolean;
  selectMode?: SelectionMode;
  onSelectChange?: (items: ITreeItem[] | ITreeItem) => void;
  onClick?: (item: ITreeItem) => void;
  onInvoke?: (item: ITreeItem) => void;
  onLinkExpandClick?: (ev?: React.MouseEvent<HTMLElement>, item?: ITreeItem) => void;
}

export interface ITreeStyleProps {
  theme: ITheme;
  className?: string;
}

export interface ITreeStyles {
  root: IStyle;
  treeNode: IStyle;
  treeGroup: IStyle;
  nodeSpace: IStyle;
  nodeArrow: IStyle;
  nodeCheckbox: IStyle;
  checkboxField: IStyle;
  nodeContent: IStyle;
}