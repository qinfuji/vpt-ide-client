import { styled } from 'office-ui-fabric-react/lib/Utilities';
import { TabsBase } from './Tabs.base';
import { getStyles } from './Tabs.styles';
import { ITabsProps, ITabsStyleProps, ITabsStyles } from './Tabs.types';

export const Tabs = styled<ITabsProps, ITabsStyleProps, ITabsStyles>(TabsBase, getStyles);
