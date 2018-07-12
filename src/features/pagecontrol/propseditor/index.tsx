import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, ITabMode } from '../../common/Tabs';
import * as styles from './index.scss';

type TabItem = {
  id: string;
  name: string;
};

const tabItems = [
  { id: 'props', name: 'Properties' },
  { id: 'event', name: 'Event' },
  { id: 'css', name: 'Css' },
  { id: 'layout', name: 'Layout' }
];

class TabsMode implements ITabMode<TabItem> {
  tooltip(tabItem: TabItem): string | null {
    return tabItem.name;
  }
  canClose(tabItem: TabItem): boolean {
    return false;
  }
  icon(tabItem: TabItem) {
    return null;
  }
  name(tabItem: TabItem) {
    return tabItem.name;
  }
  id(tabItem: TabItem) {
    return tabItem.id;
  }
}

interface PropertiesEditorProps {}

interface PropertiesEditorState {
  curTab: TabItem | null;
}

export class PropertiesEditor extends React.Component<PropertiesEditorProps, PropertiesEditorState> {
  private _tabmodel = new TabsMode();

  constructor(props: PropertiesEditorProps) {
    super(props);
    this.state = {
      curTab: tabItems[0]
    };
  }

  tabsChange(activeKey) {
    console.log(activeKey);
  }

  render() {
    let { curTab } = this.state;
    return (
      <Tabs
        items={tabItems || []}
        activeTab={curTab}
        mode={this._tabmodel}
        onTabChanged={this._onTabChanged.bind(this)}
      />
    );
  }
  private _onTabChanged = (item: TabItem, index: number) => {
    this.setState({
      curTab: item
    });
  };
}

function mapStateToProps(state: any): PropertiesEditorProps {
  return {
    //当前选择组件的id
    selectCompId: state.projectControl.pageControl.selectedCompId,
    activeTab: state.projectControl.activeTab,
    projectBaseInfo:
      state.projectControl && state.projectControl.projectInfo && state.projectControl.projectInfo.baseInfo
  };
}

function mapDispatchToProps(dispatch: Dispatch): PropertiesEditorProps {
  return {
    actions: bindActionCreators({ activeTab, closeTab }, dispatch)
  };
}
export default connect<PropertiesEditorProps>(
  mapStateToProps,
  mapDispatchToProps
)(PropertiesEditor);
