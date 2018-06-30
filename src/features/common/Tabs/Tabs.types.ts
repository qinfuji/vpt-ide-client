import * as React from 'react';
import { ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';

export interface ITabs {}

export interface ITabItem {
  [key: string]: any;
}

export interface ITabMode<T extends ITabItem> {
  icon: (tabItem: T) => string | null;
  name: (tabItem: T) => string;
  tooltip: (tabItem: T) => string | null;
  canClose: (tabItem: T) => boolean;
}

export interface ITabsProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  componentRef?: (component: ITabs | null) => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<ITabsStyleProps, ITabsStyles>;
  activeTab?: ITabItem | null | undefined;
  items?: ITabItem[] | null | undefined;
  mode: ITabMode<ITabItem>;
  onTabChanged?: (item: ITabItem, index: number) => void;
  onTabClosed?: (item: ITabItem, index: number) => void;
}

export interface ITabsStyles {
  root: IStyle;
  tabbar: IStyle;
}

export interface ITabsStyleProps {
  theme: ITheme;
  className?: string;
}
