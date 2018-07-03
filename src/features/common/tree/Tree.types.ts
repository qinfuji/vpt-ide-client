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
  getId: (item: ITreeItem) => string;
  getParent: (item: ITreeItem) => ITreeItem | null;
}

export interface ITreeProps {
  items: ITreeItem[];
  mode?: ITreeMode<ITreeItem>;
  componentRef?: (ref: ITree | null) => void | ITree;
  onRenderItem: (item: ITreeItem, isLeaf?: boolean, isExpanded?: boolean) => React.ReactNode;
  selectedKey?: string | null;
  className?: string;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<ITreeStyleProps, ITreeStyles>;
  visualCheckbox?: boolean;
  selectionMode?: SelectionMode;
  onSelectChange?: (items: ITreeItem[] | ITreeItem) => void;
  onClick?: (item: ITreeItem) => void;
  onItemInvoked?: (item?: ITreeItem) => void;
  onLinkExpandClick?: (ev?: React.MouseEvent<HTMLElement>, item?: ITreeItem) => void;
  onItemContextMenu?: (item?: any, index?: number, ev?: Event) => void | boolean;
}

export interface ITreeStyleProps {
  theme: ITheme;
  className?: string;
  treeNodeSelected?: boolean;
}

export interface ITreeStyles {
  root: IStyle;
  treeNode?: IStyle;
  treeGroup?: IStyle;
  nodeSpace?: IStyle;
  leafHead?: IStyle;
  nodeArrow?: IStyle;
  nodeCheckbox?: IStyle;
  checkboxField?: IStyle;
  nodeContent?: IStyle;
}
