import * as React from 'react';
import { IProjectStructure, IFile } from '../../common/types';
import Panel from './Panel';
import { Pane, SplitPane } from 'vpt-components';
import { SelectionMode } from 'office-ui-fabric-react/lib/Selection';
import * as stylesImport from './styles/ProjectExplorer.scss';
import { Tree, ITreeItem } from '../common/tree';
const styles: any = stylesImport;

const pagesData = [
  {
    name: 'tovfgp',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '1',
    isLeaf: false
  },
  {
    name: 'tovfgp1',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '2',
    isLeaf: true,
    parentId: '1'
  },
  {
    name: 'tovfgp2',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '3',
    isLeaf: true,
    parentId: '1'
  }
];

export interface IProjectExplorer {}

export interface IProjectExplorerProps {
  structure: IProjectStructure;
}

class ProjectExplorer extends React.Component<IProjectExplorerProps, IProjectExplorerState>
  implements IProjectExplorer {
  constructor(props: IProjectExplorerProps) {
    super(props);
  }

  render() {
    let { structure } = this.props;
    return (
      <div className={styles.root}>
        <SplitPane split="horizontal">
          <Pane initialSize="15%">
            <Panel title="LAYOUT">{this._renderLayout()}</Panel>
          </Pane>
          <Pane initialSize="40%">
            <Panel
              title="PAGES"
              toolbtns={[
                { icon: 'Refresh', key: 'pagesRefresh', onClick: key => console.log(key) },
                { icon: 'PageAdd', key: 'pageAdd', onClick: key => console.log(key) },
                { icon: 'FabricNewFolder', key: 'addFolder', onClick: key => console.log(key) }
              ]}
            >
              {this._renderPages(pagesData as any /*structure.pages*/)}
            </Panel>
          </Pane>
          <Pane initialSize="40%">
            <Panel
              title="COMMONS"
              toolbtns={[
                { icon: 'Refresh', key: 'pagesRefresh', onClick: key => console.log(key) },
                { icon: 'PageAdd', key: 'pageAdd', onClick: key => console.log(key) },
                { icon: 'FabricNewFolder', key: 'addFolder', onClick: key => console.log(key) }
              ]}
            >
              Common
            </Panel>
          </Pane>
        </SplitPane>
      </div>
    );
  }

  private _renderLayout(): JSX.Element | null {
    return null;
  }

  private _renderPages(pages: IFile[]): JSX.Element | null {
    return (
      <Tree
        items={pages as ITreeItem[]}
        onRenderItem={this._renderTreeNode}
        visualCheckbox={true}
        selectionMode={SelectionMode.none}
        onLinkExpandClick={(e, i) => {
          console.log(e, i);
        }}
        onItemContextMenu={(item, index, ev: any) => {
          console.log('onItemContextMenu', item, index);
        }}
        onItemInvoked={item => {
          console.log('onItemInvoked', item);
        }}
      />
    );
  }

  private _renderTreeNode = (item: ITreeItem): React.ReactNode => {
    return <div>{item.name}</div>;
  };
}

export default ProjectExplorer;
