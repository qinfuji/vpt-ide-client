import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { OverflowSet, IOverflowSetItemProps } from 'office-ui-fabric-react/lib/OverflowSet';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import classnames from 'classnames';
import ToolBox from './ToolsBox';
import ProjectExplorer from './ProjectExplorer';
import Dependencies from './Dependencies';
import { SplitPane, Pane } from 'vpt-components';
import OpenFileTabs from './OpenFileTabs';

import { showme as openProjectSelector } from '../selectproject/redux/actions';
import { IProjectControlInitState } from './redux/initialState';
import { IProjectInfo } from '../../common/types';
import * as styles from './styles/ProjectControl.scss';

export interface IProjectControlProps {
  projectControl: IProjectControlInitState;
  componentRef?: (component: ProjectControl | null) => void;
  actions: any;
}

export interface IProjectControlState {
  curTabkey: string;
}

class ProjectControl extends BaseComponent<IProjectControlProps, IProjectControlState> {
  constructor(props: IProjectControlProps) {
    super(props);
    this._onRenterTabItem = this._onRenterTabItem.bind(this);
    this.state = {
      curTabkey: 'projectExplorer'
    };
  }

  public componentDidMount() {
    let { projectInfo } = this.props.projectControl;
    let { openProjectSelector } = this.props.actions;
    if (!projectInfo) {
      openProjectSelector(true);
    }
  }

  public render() {
    let { projectInfo, openTabs } = this.props.projectControl;
    return (
      <div className={styles.root}>
        <SplitPane split="vertical">
          <Pane initialSize="220px" minSize="220px">
            <div className={styles.controlPanel}>
              <OverflowSet
                items={[
                  { key: 'projectExplorer', name: '资源管理器' },
                  { key: 'toolbox', name: '工具箱' },
                  { key: 'dependencies', name: '项目依赖' }
                ]}
                onRenderItem={this._onRenterTabItem}
              />
            </div>
            {projectInfo && this._renderViewPanel(projectInfo)}
          </Pane>
          <Pane>
            <OpenFileTabs />
            {this.props.children}
          </Pane>
        </SplitPane>
      </div>
    );
  }

  private _renderViewPanel(projectInfo: IProjectInfo): JSX.Element {
    let { curTabkey } = this.state;
    return (
      <div className={styles.viewPanel}>
        <div className={styles.viewPanel_content}>
          {curTabkey == 'projectExplorer' && <ProjectExplorer structure={projectInfo.structure} />}
          {curTabkey == 'toolbox' && <ToolBox items={projectInfo.components} />}
          {curTabkey == 'dependencies' && <Dependencies items={projectInfo.dependencies} />}
        </div>
      </div>
    );
  }

  private _onRenterTabItem(item: IOverflowSetItemProps): JSX.Element {
    let { curTabkey } = this.state;
    let cx = classnames(styles.controlTab, {
      [styles.contrrolTab_active]: item.key == curTabkey
    });
    return (
      <div className={cx} onClick={this._tabsClickHandle.bind(this, item.key)}>
        {item.name}
      </div>
    );
  }

  _tabsClickHandle(tabKey: string) {
    this.setState({ curTabkey: tabKey });
  }
}

function mapStateToProps(state: any) {
  return {
    projectControl: state.projectControl as IProjectControlInitState
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators({ openProjectSelector }, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectControl);
