import * as React from 'react';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { DetailsList, SelectionMode, IColumn, ConstrainMode } from 'office-ui-fabric-react/lib/DetailsList';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { SplitPane, Pane } from 'vpt-components';
import { IProjectDependencies, IProjectDependency } from '../../common/types';
import classnames from 'classnames';
import * as styles from './styles/Dependencies.scss';

export interface IDependencies {}
export interface IDependenciseProps {
  items?: IProjectDependencies;
  componentRef?: (component: IDependencies | null) => void;
  actions?: any;
}

class Dependencise extends BaseComponent<IDependenciseProps> implements IDependencies {
  constructor(props: IDependenciseProps) {
    super(props);
  }

  public render() {
    if (!this.props.items) {
      return this._renderNoData();
    }
    let rootcx = classnames('dependence-panel-container', { [styles.container]: true });
    let { dependencies, devDependencies } = this.props.items;
    return (
      <div className={rootcx}>
        <SplitPane split="horizontal">
          <Pane initialSize="50%" minSize="20%" maxSize="60%">
            {dependencies && this._renderDependencies('Dependencies', dependencies)}
          </Pane>
          <Pane>{devDependencies && this._renderDependencies('DevDependencies', devDependencies)}</Pane>
        </SplitPane>
      </div>
    );
  }

  private _renderDependencies(title: string, dependencies?: IProjectDependency[]): JSX.Element | null {
    return (
      <div className={styles.dependList}>
        <div className={styles.dependListHead}>{title}</div>
        <div className={styles.dependListAdd}>
          <TextField borderless />
          <DefaultButton text="Add" />
        </div>
        <div className={styles.dependListContent}>
          {dependencies && dependencies.length > 0 && this._renderList(dependencies)}
        </div>
      </div>
    );
  }

  private _renderNoData(): JSX.Element | null {
    return <div>no data</div>;
  }

  private _renderList(dependencies?: IProjectDependency[]): JSX.Element | null {
    if (!dependencies) {
      return this._renderNoData();
    }
    return (
      <DetailsList
        className={styles.detaillist}
        compact={false}
        isHeaderVisible={true}
        constrainMode={ConstrainMode.unconstrained}
        selectionMode={SelectionMode.none}
        items={dependencies}
        onRenderItemColumn={this._onRenderItemColumn}
        columns={[
          { key: 'name', name: 'Name', minWidth: 60, maxWidth: 75, fieldName: 'name' },
          { key: 'installed', name: 'Version', minWidth: 10, maxWidth: 52, fieldName: 'installed' },
          { key: 'operation', name: '', minWidth: 10, maxWidth: 10 }
        ]}
      />
    );
  }

  private _onRenderItemColumn(item: any, index: number, column: IColumn): JSX.Element {
    if (column.key === 'operation') {
      return (
        <div className={styles.operationBar}>
          <Icon iconName="Movers" />
          <Icon iconName="delete" />
        </div>
      );
    }
    return item[column.key];
  }
}

export default Dependencise;
