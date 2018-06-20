import * as React from 'react';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { Selection, SelectionMode } from 'office-ui-fabric-react/lib/Selection';
import { IProjectBaseInfo } from '../../common/types';
import * as styles from './ProjectList.scss';

import { DetailsList, ConstrainMode, CheckboxVisibility } from 'office-ui-fabric-react/lib/DetailsList';

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
    return (
      <div className={styles['projectListContainer-container']} data-is-scrollable>
        <DetailsList
          className={styles.detailslist}
          compact={false}
          isHeaderVisible={false}
          checkboxVisibility={CheckboxVisibility.hidden}
          onItemInvoked={this._select.bind(this)}
          constrainMode={ConstrainMode.unconstrained}
          items={items}
          columns={[
            { key: 'name', name: 'Name', minWidth: 60, maxWidth: 115, fieldName: 'name' },
            { key: 'createTime', name: 'createTime', minWidth: 10, maxWidth: 52, fieldName: 'createTime' }
          ]}
        />
      </div>
    );
  }

  private _select(item: IProjectBaseInfo, index: number) {
    let { onSelected } = this.props;
    if (onSelected) {
      onSelected(item);
    }
  }
}

export default ProjectList;
