//编辑Tab
import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Tabs, ITabMode, ITabsProps } from '../common/Tabs';
import { activeFile, closeFile } from './redux/openFiles';
import { IFile, IProjectBaseInfo } from '../../common/types';

export interface OpenFileTabsProps {
  items?: IFile[] | null | undefined;
  activedFile?: IFile;
  projectBaseInfo?: IProjectBaseInfo;
  actions?: any;
}

class OpenFileTabsMode implements ITabMode<IFile> {
  tooltip(tabItem: IFile): string | null {
    return tabItem.path;
  }
  canClose(tabItem: IFile): boolean {
    return true;
  }
  icon(tabItem: IFile) {
    return null;
  }
  name(tabItem: IFile) {
    return tabItem.name;
  }
  id(tabItem: IFile) {
    return tabItem.path;
  }
}

class OpenFileTabs extends React.Component<OpenFileTabsProps> {
  private _mode: OpenFileTabsMode;

  constructor(props: OpenFileTabsProps) {
    super(props);
    this._mode = new OpenFileTabsMode();
  }

  render() {
    let { items, activedFile } = this.props;
    return (
      <Tabs
        items={items || []}
        activeTab={activedFile}
        mode={this._mode}
        onTabClosed={this._onTabClosed.bind(this)}
        onTabChanged={this._onTabChanged.bind(this)}
      />
    );
  }

  private _onTabClosed(item: IFile, index: number) {
    let { closeFile } = this.props.actions;
    let { projectBaseInfo } = this.props;
    if (projectBaseInfo && closeFile) {
      closeFile(projectBaseInfo.id, item, index);
    }
  }

  private _onTabChanged(item: IFile, index: number) {
    let { activeFile } = this.props.actions;
    let { projectBaseInfo } = this.props;
    if (closeFile && projectBaseInfo) {
      activeFile(projectBaseInfo.id, item, index);
    }
  }
}

function mapStateToProps(state: any): OpenFileTabsProps {
  return {
    items: state.projectControl.openedFiles,
    activedFile: state.projectControl.activedFile,
    projectBaseInfo:
      state.projectControl && state.projectControl.projectInfo && state.projectControl.projectInfo.baseInfo
  };
}

function mapDispatchToProps(dispatch: Dispatch): OpenFileTabsProps {
  return {
    actions: bindActionCreators({ activeFile, closeFile }, dispatch)
  };
}
export default connect<OpenFileTabsProps>(
  mapStateToProps,
  mapDispatchToProps
)(OpenFileTabs);
