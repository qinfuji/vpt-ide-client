import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Store } from '../pagetree/Store';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Tabs, ITabMode } from '../../common/Tabs';
import * as styles from './index.scss';
import { IFile, IProjectInfo, IPropertyEditInfo, IPropertyType, IPropertyCategroy } from '../../../common/types';
import { Map } from 'immutable';

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

interface PropertiesEditorProps {
  propsEditInfo: IPropertyEditInfo;
  activedFile: IFile;
  projectInfo: IProjectInfo;
}

interface PropertiesEditorState {
  curTab: TabItem | null;
}

export class PropertiesEditor extends React.Component<PropertiesEditorProps, PropertiesEditorState> {
  private _tabmodel = new TabsMode();

  static contextTypes = {
    activedFile: PropTypes.object.isRequired,
    projectBaseInfo: PropTypes.object.isRequired,
    pageTreeStore: PropTypes.object.isRequired
  };

  context: {
    activedFile: IFile;
    projectBaseInfo: IProjectBaseInfo;
    pageTreeStore: Store;
  };

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
      <div className={styles.root}>
        <Tabs
          items={tabItems || []}
          activeTab={curTab}
          mode={this._tabmodel}
          onTabChanged={this._onTabChanged.bind(this)}
        />
        <div className={styles.editPanel}>{this._editPanel()}</div>
      </div>
    );
  }

  private _editPanel(): React.ReactNode | null {
    console.log(this.props);
    // let { node } = this.props;
    // if (!node) {
    //   return <span>No selection</span>;
    // }
    // try {
    //   //var keys = node.keySeq().toArray();
    //   //console.log(keys);
    //   console.log('name', node.get('name'));
    //   console.log('nodeType', node.get('nodeType'));
    //   console.log('children', node.get('children'));
    //   console.log('key', node.get('key'));
    //   //console.log('props', node.get('props'));
    //   let props = node.get('props');
    //   //let propsKeys = Object.keys(props);
    //   for (const key in props) {
    //     if (key !== 'children') {
    //       console.log(key, props[key]);
    //       if (key === 'onClick') {
    //         console.log(Object.keys(props[key]));
    //       }
    //     }
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
    return null;
  }

  private _onTabChanged = (item: TabItem, index: number) => {
    this.setState({
      curTab: item
    });
  };
}

function mapStateToProps(state: any): PropertiesEditorProps {
  return {
    propsEditInfo: state.projectControl.propsEditInfo,
    projectInfo: state.projectControl.projectInfo,
    activedFile: state.projectControl.activedFile
  };
}

// function mapDispatchToProps(dispatch: Dispatch): PropertiesEditorProps {
//   return {
//     actions: bindActionCreators({}, dispatch)
//   };
// }
export default connect<PropertiesEditorProps, {}>(
  mapStateToProps,
  {}
)(PropertiesEditor);
