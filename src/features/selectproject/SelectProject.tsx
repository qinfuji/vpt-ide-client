import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
//import PropTypes from 'prop-types';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import ProjectList from './ProjectList';
import { FETCH_PROJECTS_BEGIN, FETCH_PROJECTS_SUCCESS, FETCH_PROJECTS_FAILURE } from './redux/constants';

import { showme, fetchProjects } from './redux/actions';
import { select } from './services';
import { changeProject } from '../projectcontrol/redux/actions';
import { ISelectProjectInitState } from './redux/initialState';
import { IProjectBaseInfo } from '../../common/types';
import * as styles from './index.scss';

export interface ISelectProject {}

export interface ISelectProjectProps {
  selectProject: ISelectProjectInitState;
  actions: any;
  componentRef?: (component: ISelectProject | null) => void;
}

class SelectProject extends BaseComponent<ISelectProjectProps> implements ISelectProject {
  state = {};

  render() {
    let { showme, fetchProjectsStatus, projects } = this.props.selectProject;
    return (
      showme && (
        <Dialog
          dialogContentProps={{
            type: DialogType.close,
            title: '项目列表'
          }}
          hidden={false}
          modalProps={{
            onLayerDidMount: this._fatchProjects.bind(this),
            isBlocking: true,
            containerClassName: 'selectproject-dialogMainOverride'
          }}
          onDismiss={this._close.bind(this)}
        >
          <div className={styles.projectListContainer}>
            {FETCH_PROJECTS_BEGIN == fetchProjectsStatus && this._renderSpinner()}
            {FETCH_PROJECTS_SUCCESS == fetchProjectsStatus && projects && this._renderProjectList(projects)}
            {FETCH_PROJECTS_FAILURE == fetchProjectsStatus && this._renderSpinner()}
          </div>
        </Dialog>
      )
    );
  }

  private _fatchProjects() {
    let { fetchProjects } = this.props.actions;
    fetchProjects();
  }

  private _close() {
    let { showme } = this.props.actions;
    showme(false);
  }

  private _renderProjectList(projects: IProjectBaseInfo[]) {
    return <ProjectList items={projects} onSelected={this._projectSelected.bind(this)} />;
  }

  private async _projectSelected(item: IProjectBaseInfo) {
    let { showme, changeProject } = this.props.actions;
    try {
      await select(item.id);
      showme(false);
      changeProject(item.id);
    } catch (err) {
      //TODO 这里需要处理异常情况
      console.log(err);
    }
  }

  private _renderSpinner() {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner size={SpinnerSize.medium} />
      </div>
    );
  }

  private _renderErrMessage() {
    <div>
      <MessageBar dismissButtonAriaLabel="Close" isMultiline={false} messageBarType={MessageBarType.error}>
        加载项目失败，请重新加载!
      </MessageBar>
    </div>;
  }
}

function mapStateToProps(state: any) {
  return {
    selectProject: state.selectProject
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators({ showme, fetchProjects, changeProject }, dispatch)
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelectProject);
