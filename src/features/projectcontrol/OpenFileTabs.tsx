//编辑Tab
import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Tabs, ITabMode, ITabItem, ITabsProps } from '../common/Tabs';
import { activeTab, closeTab } from './redux/openTabs';
import { IFile, IProjectBaseInfo } from '../../common/types';

export interface OpenFileTabsProps extends ITabsProps {
  item?: IFile[] | null | undefined;
  activeTab?: IFile;
  projectBaseInfo?: IProjectBaseInfo;
  actions: any;
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
    let { items, activeTab } = this.props;
    return (
      <Tabs
        items={items}
        activeTab={activeTab}
        mode={this._mode}
        onTabClosed={this._onTabClosed.bind(this)}
        onTabChanged={this._onTabChanged.bind(this)}
      />
    );
  }

  private _onTabClosed(item: IFile, index: number) {
    let { closeTab } = this.props.actions;
    let { projectBaseInfo } = this.props;
    if (projectBaseInfo && closeTab) {
      closeTab(projectBaseInfo.id, item, index);
    }
  }

  private _onTabChanged(item: IFile, index: number) {
    let { activeTab } = this.props.actions;
    let { projectBaseInfo } = this.props;
    if (closeTab && projectBaseInfo) {
      activeTab(projectBaseInfo.id, item, index);
    }
  }
}

function mapStateToProps(state: any) {
  return {
    items: state.projectControl.openTabs,
    activeTab: state.projectControl.activeTab,
    projectBaseInfo:
      state.projectControl && state.projectControl.projectInfo && state.projectControl.projectInfo.baseInfo
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators({ activeTab, closeTab }, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OpenFileTabs);
