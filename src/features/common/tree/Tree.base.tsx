import * as React from 'react';
import { BaseComponent, customizable, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { ITree, ITreeProps, ITreeItem } from './Tree.types';

const getClassNames = classNamesFunction<IDialogStyleProps, IDialogStyles>();

export interface ITreeState {
  //isGroupCollapsed?: { [key: string]: boolean };
  //isLinkExpandStateChanged?: boolean;
  selectedKey?: string;
}

@customizable('Tree', ['theme'])
export class TreeBase extends BaseComponent<ITreeProps, ITreeState> implements ITree {
  constructor(props: ITreeProps) {
    super(props);
    this.state = {
      //isGroupCollapsed: {},
      //isLinkExpandStateChanged: false,
      selectedKey: props.initialSelectedKey || props.selectedKey
    };
  }

  render() {
    const { className, theme, styles, items, getChildren, onRenderItem } = this.props;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className: className
    });
    return (
      <div className={classNames.root}>
        {items &&
          items.map((item, index) => {
            let children = item.children || (getChildren ? getChildren(item) : null);
            if (children && children.length > 0) {
              //如果存在子节点，则加入容器
              return <div className={classNames.treeGroup}>{this._renderTreeNode(item)}</div>;
            } else {
              return this._renderTreeNode(item);
            }
          })}
      </div>
    );
  }

  private _renderTreeNode = (item: ITreeItem) => {
    const { className, theme, styles, onRenderItem } = this.props;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className: className
    });
    return (
      <div className={classNames.treeNode}>
        <span>space</span>
        <span>arrow</span>
        <span>checkbox</span>
        <span>{onRenderItem(item)}</span>
      </div>
    );
  };
}
