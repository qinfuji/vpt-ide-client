import { ITreeStyleProps, ITreeStyles } from './Tree.types';
import { normalize, FontSizes, FontWeights, getGlobalClassNames } from 'office-ui-fabric-react/lib/Styling';
//import {memoizeFunction} from 'office-ui-fabric-react/lib/Utilities'

const GlobalClassNames = {
  root: 'vpt-Tree',
  treeNode: 'vpt-TreeNode',
  treeGroup: 'vpt-treeGroup'
};

export const getStyles = (props: ITreeStyleProps): ITreeStyles => {
  const { theme, className } = props;

  const classNames = getGlobalClassNames(GlobalClassNames, theme);

  return {
    root: [classNames.root, className],
    treeNode: [
      classNames.treeNode,
      {
        userSelect: 'none', //禁止双击选择
        height: '1.8rem',
        lineHeight: '1.8rem',
        display: 'flex',
        flexFlow: 'row',
        fontSize: FontSizes.medium,
        fontWeight: FontWeights.semilight,
        selectors: {
          '&:hover': {
            backgroundColor: theme.palette.neutralLighter
          },
          '&:focus': {
            outline: 0,
            backgroundColor: theme.palette.neutralLighter
          }
        }
      }
    ],
    treeGroup: [],
    nodeSpace: [{}],
    leafHead: [{ minWidth: '18px' }],
    nodeArrow: [{ display: 'flex', marginRight: '2px' }],
    nodeCheckbox: [{ display: 'inherit', marginLeft: '5px', marginRight: '5px', marginTop: '4px' }],
    checkboxField: [{ width: FontSizes.smallPlus, height: FontSizes.smallPlus }],
    nodeContent: [{ display: 'flex', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }]
  };
};
