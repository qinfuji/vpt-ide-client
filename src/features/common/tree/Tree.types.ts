import { IStyle, ITheme } from 'office-ui-fabric-react/lib/Styling';

export interface ITree {}

export interface ITreeItem {
  children?: ITreeItem[];
  showCheck?: boolean;
  [key: string]: any;
}

export interface ITreeProps {
  items?: ITreeItem;
  getChildren?: (item: ITreeItem) => ITreeItem[] | null;
  componentRef?: (ref: ITreeItem | null) => void | ITreeItem;
  onRenderItem: (nestingDepth: number, item: ITreeItem, index?: number) => React.ReactNode;
  initialSelectedKey?: string;
  selectedKey?: string;
}

export interface ITreeStyleProps {
  /**
   * Accept theme prop.
   */
  theme: ITheme;

  /**
   * Accept custom classNames
   */
  className?: string;

  /**
   * is element on top boolean
   */
  isOnTop?: boolean;

  /**
   * is element a link boolean
   */
  isLink?: boolean;

  /**
   * is element a group boolean
   */
  isGroup?: boolean;

  /**
   * is element expanded boolean
   */
  isExpanded?: boolean;

  /**
   * is element selected boolean
   */
  isSelected?: boolean;

  /**
   * is button
   */
  isButtonEntry?: boolean;

  /**
   * Nav height value
   */
  navHeight?: number;

  /**
   * left padding value
   */
  leftPadding?: number;

  /**
   * left padding when expanded value
   */
  leftPaddingExpanded?: number;

  /**
   * right padding value
   */
  rightPadding?: number;

  /**
   * position value
   */
  position?: number;

  /**
   * Inherited from INavProps
   * A collection of link groups to display in the navigation bar
   */
  //groups: INavLinkGroup[] | null;
}

export interface ITreeStyles {
  /**
   * Style set for the root element.
   */
  root: IStyle;

  /**
   * Style set for the link text container div element.
   */
  linkText: IStyle;

  /**
   * Style set for the link element extending the
   * root style set for ActionButton component.
   */
  link: IStyle;

  /**
   * Style set for the composite link container div element
   */
  compositeLink: IStyle;

  /**
   * Style set for the chevron button inside the composite
   * link and group elements.
   */
  chevronButton: IStyle;

  /**
   * Style set for the chevron icon inside the composite
   * link and group elements.
   */
  chevronIcon: IStyle;

  /**
   * Style set for the nav links ul element.
   */
  navItems: IStyle;

  /**
   * Style set for the nav links li element.
   */
  navItem: IStyle;

  /**
   * Style set for the group root div.
   */
  group: IStyle;

  /**
   * Style set for the group content div inside group.
   */
  groupContent: IStyle;
}
