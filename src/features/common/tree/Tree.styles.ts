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
    root: [classNames.root, { marginTop: '10px', marginLeft: '10px' }, className],
    treeNode: [
      classNames.treeNode,
      {
        height: '30px',
        lineHeight: '30px',
        display: 'flex',
        fontSize: FontSizes.mediumPlus,
        fontWeight: FontWeights.regular,
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
    nodeSpace: [{ display: 'inline-block' }],
    nodeArrow: [{ display: 'flex' }],
    nodeCheckbox: [{ display: 'inherit', marginLeft: '5px', marginRight: '5px', marginTop: '4px' }],
    checkboxField: [{ width: 14, height: 14 }],
    nodeContent: [{ marginLeft: '5px' }]
  };
};
