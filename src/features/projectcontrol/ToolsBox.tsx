import * as React from 'react';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { TooltipHost, TooltipDelay } from 'office-ui-fabric-react/lib/Tooltip';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { DirectionalHint } from 'office-ui-fabric-react/lib/common/DirectionalHint';
import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/Selection';

import * as styles from './styles/ToolsBox.scss';
import { IProjectComponent } from '../../common/types';

export interface IToolsBox {}

export interface IToolsBoxProps {
  items: IProjectComponent[];
  componentRef?: (component: IToolsBox | null) => void;
}

class ToolsBox extends BaseComponent<IToolsBoxProps> implements IToolsBox {
  private _selection: Selection;

  constructor(props: IToolsBoxProps) {
    super(props);

    this._selection = new Selection({
      getKey: (item: IProjectComponent) => item.name,
      selectionMode: SelectionMode.single
    });

    let { items } = props;
    this._selection.setItems(items);
  }

  private _select = (item: IProjectComponent, index: number) => {
    console.log('--->', index, item);
  };

  private _onRenderCell = (item: IProjectComponent, index: number) => {
    return (
      <div className={styles.toolListItem} data-is-draggable data-selection-index={index} draggable>
        <Image
          className={styles['toolListItem-itemImage']}
          height={40}
          imageFit={ImageFit.cover}
          src={item.logo}
          width={40}
        />
        <div className={styles['toolListItem-name']}>
          <span>{item.name}</span>
        </div>

        <Icon
          className={styles['toolListItem-operationBtn']}
          iconName="Delete"
          onClick={() => {
            console.log('aaaa');
          }}
        />
      </div>
    );
  };

  private _renderToolList() {
    let { items } = this.props;
    return (
      <SelectionZone onItemInvoked={this._select} selection={this._selection}>
        <List items={items} onRenderCell={this._onRenderCell} />
      </SelectionZone>
    );
  }

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.head}>
          <span className={styles.title}>工具箱</span>
          <span className={styles.tools}>
            <TooltipHost
              calloutProps={{
                directionalHint: DirectionalHint.topCenter
              }}
              content="刷新组件"
              delay={TooltipDelay.zero}
            >
              <Icon className={styles.toolsIcon} iconName="refresh" />
            </TooltipHost>
            <TooltipHost
              calloutProps={{
                directionalHint: DirectionalHint.topCenter
              }}
              content="添加组件"
              delay={TooltipDelay.zero}
            >
              <Icon className={styles.toolsIcon} iconName="add" />
            </TooltipHost>
          </span>
        </div>
        <div className={styles.toolList}>{this._renderToolList()}</div>
      </div>
    );
  }
}

export default ToolsBox;
