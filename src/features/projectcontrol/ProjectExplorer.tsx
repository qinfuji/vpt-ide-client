import * as React from 'react';
import { IProjectStructure, IFile } from '../../common/types';
import Panel from './Panel';
import { Pane, SplitPane } from 'vpt-components';
import { SelectionMode } from 'office-ui-fabric-react/lib/Selection';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as stylesImport from './styles/ProjectExplorer.scss';
import { Tree, ITreeItem } from '../common/tree';
import { FsTreeMode } from './FsTreeMode';
const styles: any = stylesImport;

const pagesData = [
  {
    name: 'PAGE',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '1',
    isLeaf: false
  },
  {
    name: 'page1',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '2',
    isLeaf: false,
    parentId: '1'
  },
  {
    name: 'page2',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '3',
    isLeaf: true,
    parentId: '1'
  },

  {
    name: 'DIALOG',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '4'
  },
  {
    name: 'tovfgp4',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '5',
    isLeaf: true,
    parentId: '4'
  },
  {
    name: 'tovfgp5',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '6',
    isLeaf: true,
    parentId: '4'
  },
  {
    name: 'WIDGET',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '7'
  },
  {
    name: 'tovfgp4',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '8',
    isLeaf: true,
    parentId: '7'
  },

  {
    name: 'tovfgp4',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '10',
    isLeaf: true,
    parentId: '2'
  },
  {
    name: 'tovfgp5',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '11',
    isLeaf: true,
    parentId: '2'
  },
  {
    name: 'tovfgp5',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '12',
    isLeaf: true,
    parentId: '2'
  },

  {
    name: 'index.js',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '12',
    isLeaf: true
  },

  {
    name: 'routers.js',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '13',
    isLeaf: true
  },

  {
    name: 'index.html',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '14',
    isLeaf: true
  },
  {
    name: 'login.js',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '15',
    isLeaf: true
  },

  {
    name: 'App.js',
    label: 'mgfeei',
    type: 'DIALOG',
    path: 'voluptate consectetur',
    id: '16',
    isLeaf: true
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
        <Panel
          title="PAGES"
          toolbtns={[
            { icon: 'Refresh', key: 'pagesRefresh', onClick: key => console.log(key) },
            { icon: 'PageAdd', key: 'pageAdd', onClick: key => console.log(key) },
            { icon: 'FabricNewFolder', key: 'addFolder', onClick: key => console.log(key) }
          ]}
        >
          {this._renderPages(structure.pages)}
        </Panel>
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
        getMode={() => {
          return new FsTreeMode();
        }}
        onRenderItem={this._renderTreeNode}
        visualCheckbox={false}
        selectionMode={SelectionMode.multiple}
        onLinkExpandClick={(e, i) => {
          console.log(e, i);
        }}
        onItemContextMenu={(item, index, ev: any) => {
          console.log('onItemContextMenu', item, index);
        }}
        onItemInvoked={item => {
          console.log('onItemInvoked', item);
        }}
        styles={{ root: { margin: '10px 0 0 15px' } }}
      />
    );
  }

  private _renderTreeNode = (item: ITreeItem, isLeaf?: boolean, isExpanded?: boolean): React.ReactNode | null => {
    if (isLeaf) {
      return (
        <div>
          <Icon iconName="Page" styles={{ root: { marginRight: '5px' } }} />
          {item.name}
        </div>
      );
    }

    return (
      <div style={{ display: 'flex' }}>
        <Icon
          iconName={isExpanded ? 'OpenFolderHorizontal' : 'FolderHorizontal'}
          styles={{ root: { marginRight: '5px' } }}
        />
        <div>{item.name}</div>
      </div>
    );
  };
}

export default ProjectExplorer;
