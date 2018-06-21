import { styled } from 'office-ui-fabric-react/lib/Utilities';
import { ITreeProps, ITreeStyleProps, ITreeStyles } from './Tree.types';
import { TreeBase } from './Tree.base';
import { getStyles } from './Tree.styles';

export const Nav = styled<INavProps, INavStyleProps, INavStyles>(NavBase, getStyles);
