import * as React from 'react';
import { IProjectStructure, IFile } from '../../common/types';
import Panel from './Panel';
import { Pane, SplitPane } from 'vpt-components';
import * as stylesImport from './styles/ProjectExplorer.scss';
import { Tree, ITreeItem } from '../common/tree';
const styles: any = stylesImport;

console.log(styles);
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
              {this._renderPages(structure.pages)}
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
    console.log(pages);
    return <Tree items={pages as ITreeItem[]} onRenderItem={this._renderTreeNode} />;
  }

  private _renderTreeNode = (item: ITreeItem): React.ReactNode => {
    return <div>111</div>;
  };
}

export default ProjectExplorer;
