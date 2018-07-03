import * as React from 'react';
import { IProjectStructure, IFile, IProjectBaseInfo } from '../../common/types';
import history from '../../common/history';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
//import Panel from './Panel';
import { Panel } from '../common/Panel';
import { SelectionMode } from 'office-ui-fabric-react/lib/Selection';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import * as stylesImport from './styles/ProjectExplorer.scss';
import { Tree, ITreeItem } from '../common/tree';
import { FsTreeMode } from './FsTreeMode';
import { activeTab } from './redux/openTabs';
const styles: any = stylesImport;

export interface IProjectExplorer {}

export interface IProjectExplorerProps {
  structure: IProjectStructure;
  projectBaseInfo: IProjectBaseInfo;
  actions: any;
}

class ProjectExplorer extends React.Component<IProjectExplorerProps, IProjectExplorerState>
  implements IProjectExplorer {
  private _mode = new FsTreeMode();
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

  private _renderPages(pages: IFile[]): JSX.Element | null {
    return (
      <Tree
        items={pages as ITreeItem[]}
        mode={this._mode}
        onRenderItem={this._renderTreeNode}
        visualCheckbox={false}
        selectionMode={SelectionMode.multiple}
        onLinkExpandClick={(e, i) => {
          console.log('onLinkExpandClick', e, i);
        }}
        onItemContextMenu={(item, index, ev: any) => {
          console.log('onItemContextMenu', item, index);
        }}
        onItemInvoked={this._fileSelect}
        styles={{ root: { margin: '10px 0 0 15px' } }}
        onSelectChange={items => {
          console.log('onSelectChange', items);
        }}
      />
    );
  }

  private _fileSelect = (item: IFile) => {
    if (this._mode.isLeaf(item)) {
      //history.push(`/project/file/${encodeURIComponent(item.path)}/${item.type}`);
      let { activeTab } = this.props.actions;
      let { projectBaseInfo } = this.props;
      activeTab(projectBaseInfo.id, item);
    }
  };

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

function mapStateToProps(state: any) {
  return {
    structure: state.projectControl.projectInfo.structure,
    projectBaseInfo: state.projectControl.projectInfo.baseInfo
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators({ activeTab }, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectExplorer);
