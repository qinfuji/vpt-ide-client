//import { HighContrastSelector } from 'office-ui-fabric-react/lib/Utilities';
import { ITabsStyleProps, ITabsStyles } from './Tabs.types';

export const getStyles = (props: ITabsStyleProps): ITabsStyles => {
  const { theme, className } = props;

  return {
    root: [
      'vpt-tabs',
      {
        padding: '2px 5px 0 0',
        height: '30px',
        backgroundColor: theme.palette.neutralLighter
      }
    ],
    tabbar: []
  };
};
