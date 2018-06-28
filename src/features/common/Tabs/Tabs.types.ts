import * as React from 'react';
import { ITheme, IStyle } from 'office-ui-fabric-react/lib/Styling';
import { IStyleFunctionOrObject } from 'office-ui-fabric-react/lib/Utilities';

export interface ITabs {}

export interface ITabItem {
  name: string;
}

export interface ITabsProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  componentRef?: (component: ITabs | null) => void;
  theme?: ITheme;
  styles?: IStyleFunctionOrObject<ITabsStyleProps, ITabsStyles>;
  activeTab?: number | string;
  items: ITabItem[];
}

export interface ITabsStyles {
  root: IStyle;
  tabbar: IStyle;
}

export interface ITabsStyleProps {
  theme: ITheme;
  className?: string;
}
