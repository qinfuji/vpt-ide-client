import * as React from 'react';
import { IProjectStructure, IFile } from '../../common/types';
import { List } from 'office-ui-fabric-react/lib/List';
import Panel from './Panel';
import * as stylesImport from './styles/ProjectExplorer.scss';
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
        {structure &&
          structure.layouts && (
            <Panel title="LAYOUT" toolbtns={[{ icon: 'PageAdd', key: 'layoutPageAdd' }]}>
              {this._renderLayout()}
            </Panel>
          )}
        {structure &&
          structure.pages && (
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
          )}
        {structure &&
          structure.commons && (
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
          )}
      </div>
    );
  }

  private _renderLayout(): JSX.Element | null {
    return null;
  }

  private _renderPages(pages: IFile[]): JSX.Element | null {
    return <List items={pages} onRenderCell={this._renderPageCell} />;
  }

  private _renderPageCell(item, index) {
    return <div>aaa</div>;
  }
}

export default ProjectExplorer;
