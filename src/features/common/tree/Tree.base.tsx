import * as React from 'react';
import { BaseComponent, customizable, classNamesFunction } from 'office-ui-fabric-react/lib/Utilities';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { ITree, ITreeProps, ITreeItem, ITreeMode, ITreeStyleProps, ITreeStyles } from './Tree.types';
import { DefaultTreeMode } from './DefaultTreeMode';
import { SelectionZone, Selection, SelectionMode, IObjectWithKey } from 'office-ui-fabric-react/lib/Selection';
import { getStyles } from './Tree.styles';
const getClassNames = classNamesFunction<ITreeStyleProps, ITreeStyles>();

export interface ITreeState {
  //isGroupCollapsed?: { [key: string]: boolean };
  isLinkExpandStateChanged?: boolean;
  selectedKey: string | null;
  selection: Selection;
  nodeExpandStates: { [key: string]: boolean };
}

@customizable('Tree', ['theme'])
export class TreeBase extends BaseComponent<ITreeProps, ITreeState> implements ITree {
  private _treeMode: ITreeMode<ITreeItem>;

  constructor(props: ITreeProps) {
    super(props);
    let { items, selectMode = SelectionMode.none, getMode } = this.props;
    this._treeMode = getMode ? getMode() : (new DefaultTreeMode() as any);
    this.state = {
      selectedKey: props.initialSelectedKey || props.selectedKey || null,
      selection: new Selection({ getKey: item => (item as ITreeItem).id, selectionMode: selectMode }),
      nodeExpandStates: {}
    };
    this.state.selection.setItems(items as IObjectWithKey[]);
    this._treeMode.setItems(items);
  }

  componentWillReceiveProps(newProps: ITreeProps) {
    if (newProps.items !== this.props.items) {
      this._treeMode.setItems(newProps.items);
    }
  }

  render() {
    const { className, theme, styles, selectMode = SelectionMode.none } = this.props;
    const { selection } = this.state;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className: className
    });
    let roots = this._treeMode.getRoot();
    return (
      <SelectionZone selection={selection} selectionMode={selectMode} onItemInvoked={id => console.log(id)}>
        <FocusZone direction={FocusZoneDirection.vertical}>
          <div className={classNames.root}>{this._renderTreeNodes(roots, 0)}</div>
        </FocusZone>
      </SelectionZone>
    );
  }

  private _renderTreeNodes = (items: ITreeItem[], nestingLevel: number): React.ReactElement<{}>[] => {
    let treeNodes = items.map(
      (item: ITreeItem, index: number): any => {
        let isLeaf = this._treeMode.isLeaf(item);
        if (isLeaf) {
          return this._renderNode(item, nestingLevel, true, false);
        } else {
          return this._renderCompositeNode(item, nestingLevel);
        }
      }
    );
    return treeNodes;
  };

  private _renderNode(
    item: ITreeItem,
    nestingLevel: number,
    isLeaf: boolean,
    isExpanded: boolean
  ): React.ReactElement<{}> {
    const { className, theme, styles, visualCheckbox, onRenderItem } = this.props;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className: className
    });
    let index = this._treeMode.getItemIndex(item);
    return (
      <div key={index} className={classNames.treeNode} data-selection-select data-selection-index={index}>
        <span className={classNames.nodeSpace} style={{ width: 20 * nestingLevel + 'px', display: 'inline-block' }} />
        <span className={classNames.nodeArrow} onClick={this._onExpandClicled.bind(this, item)}>
          {isLeaf && (
            <div>
              <Icon iconName="" />
              <Icon iconName="" />
            </div>
          )}
          {!isLeaf &&
            isExpanded && (
              <div>
                <Icon iconName="CaretSolid" />
                <Icon iconName="OpenFolderHorizontal" />
              </div>
            )}
          {!isLeaf &&
            !isExpanded && (
              <div>
                <Icon iconName="CaretHollow" />
                <Icon iconName="FolderHorizontal" />
              </div>
            )}
        </span>
        <span className={classNames.nodeCheckbox}>
          {visualCheckbox && <Checkbox styles={{ checkbox: classNames.checkboxField }} />}
        </span>
        <div className={classNames.nodeContent}>{onRenderItem && onRenderItem(item)}</div>
      </div>
    );
  }

  private _renderCompositeNode(item: ITreeItem, nestingLevel: number) {
    const { className, theme, styles } = this.props;
    const classNames = getClassNames(styles!, {
      theme: theme!,
      className: className
    });
    let children = this._treeMode.getChild(item);
    let index = this._treeMode.getItemIndex(item);
    let id = this._treeMode.getId(item);
    let originExpanded = this._treeMode.isExpanded(item);
    let currExpanded = this.state.nodeExpandStates[id];
    let expanded = currExpanded !== undefined ? currExpanded : originExpanded;
    return (
      <div key={index} className={classNames.treeGroup}>
        {this._renderNode(item, nestingLevel, false, expanded)}
        {expanded && children && children.length > 0 && this._renderTreeNodes(children, nestingLevel)}
      </div>
    );
  }

  private _onExpandClicled(item: ITreeItem, ev: React.MouseEvent<HTMLElement>): void {
    const { onLinkExpandClick } = this.props;

    if (onLinkExpandClick) {
      onLinkExpandClick(ev, item);
    }

    if (!ev.defaultPrevented) {
      let originExpandedState = this._treeMode.isExpanded(item);
      let id = this._treeMode.getId(item); //获取元素的唯一标示
      let curExpandState = this.state.nodeExpandStates[id]; //当前选择状态
      if (curExpandState === undefined || curExpandState == null) {
        this.setState({ nodeExpandStates: { ...this.state.nodeExpandStates, [id]: !originExpandedState } });
      } else {
        this.setState({ nodeExpandStates: { ...this.state.nodeExpandStates, [id]: !curExpandState } });
      }

      ev.preventDefault();
      ev.stopPropagation();
    }
  }
}
