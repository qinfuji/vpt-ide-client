import { ITreeStyleProps, ITreeStyles } from './Tree.types';
import { normalize, FontSizes, FontWeights, getGlobalClassNames } from 'office-ui-fabric-react/lib/Styling';

const GlobalClassNames = {
  root: 'vpt-Tree',
  treeNode: 'vpt-TreeNode',
  treeGroup: 'vpt-treeGroup'
};

export const getStyles = (props: ITreeStyleProps): ITreeStyles => {
  const { theme, className } = props;

  const classNames = getGlobalClassNames(GlobalClassNames, theme);

  return {
    root: [classNames.root, { color: 'red' }, className],
    treeNode: [
      classNames.treeNode,
      {
        height: '32px'
        //backgroundColor: theme.palette.neutralLight
      }
    ],
    treeGroup: []
  };
};
