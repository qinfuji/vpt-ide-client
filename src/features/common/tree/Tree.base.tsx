import * as React from 'react';
import { BaseComponent, customizable } from 'office-ui-fabric-react/lib/Utilities';
import { ITree, ITreeItem, ITreeProps } from './Tree.types';

export interface ITreeState {
  isGroupCollapsed?: { [key: string]: boolean };
  isLinkExpandStateChanged?: boolean;
  selectedKey?: string;
}

@customizable('Tree', ['theme'])
class TreeBase extends BaseComponent<ITreeProps, ITreeState> implements ITree {
  constructor(props: ITreeProps) {
    super(props);
    this.state = {
      isGroupCollapsed: {},
      isLinkExpandStateChanged: false,
      selectedKey: props.initialSelectedKey || props.selectedKey
    };
  }

  render() {
    return <div>我是Tree</div>;
  }
}

export default TreeBase;
