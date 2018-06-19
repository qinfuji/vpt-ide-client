import * as React from 'react';
import { BaseComponent, createRef } from 'office-ui-fabric-react/lib/Utilities';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Selection, SelectionMode, SelectionZone } from 'office-ui-fabric-react/lib/Selection';
import { IProjectBaseInfo } from '../../common/types';
import * as styles from './ProjectList.scss';

export interface IProjectList {}

export interface IProjectListProps {
  items: IProjectBaseInfo[];
  onSelected: (item: IProjectBaseInfo) => void;
  componentRef?: (component: IProjectList | null) => void;
}

export interface IProjectListState {
  selection: Selection;
}

class ProjectList extends BaseComponent<IProjectListProps, IProjectListState> {
  private _focusZone = createRef<FocusZone>();

  constructor(props: IProjectListProps) {
    super(props);

    this.state = {
      selection: new Selection({
        getKey: (item: IProjectBaseInfo) => item.name,
        selectionMode: SelectionMode.single
      })
    };
    let { items } = this.props;
    this.state.selection.setItems(items, true);
  }

  render() {
    let { items } = this.props;
    let { selection } = this.state;
    return (
      <div className={styles['projectListContainer-container']} data-is-scrollable>
        <SelectionZone onItemInvoked={this._select.bind(this)} selection={selection}>
          <FocusZone componentRef={this._focusZone} direction={FocusZoneDirection.vertical}>
            <List items={items} onRenderCell={this._onRenderCell} />
          </FocusZone>
        </SelectionZone>
      </div>
    );
  }

  // static getDerivedStateFromProps(props: IProjectListProps, state: IProjectListState) {
  //   return null;
  // }

  private _select(item: IProjectBaseInfo, index: number) {
    let { onSelected } = this.props;
    if (onSelected) {
      onSelected(item);
    }
  }

  private _onRenderCell(item: IProjectBaseInfo, index: number, isScrolling: boolean) {
    return (
      <div
        className={styles['projectListContainer-itemCell']}
        data-is-focusable
        data-selection-index={index}
        /*data-selection-invoke  选择后鼠标单击后触发*/
        data-selection-select /* 一般该属性用于<a>标签的情况，在事件触发前执行*/
      >
        <Image
          className={styles['projectListContainer-itemImage']}
          height={40}
          imageFit={ImageFit.cover}
          src={isScrolling ? undefined : item.logo}
          width={40}
        />
        <div className={styles['projectListContainer-itemContent']}>
          <div className={styles['projectListContainer-itemName']}>{item.name}</div>
          <div className={styles['projectListContainer-itemIndex']}>{`Item ${index}`}</div>
        </div>
      </div>
    );
  }
}

export default ProjectList;
