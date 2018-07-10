import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { IFile, IProjectBaseInfo } from '../../common/types';
import PageEditor from './PageEditor';

export interface PageControlProps {
  actions?: any;
  activeFile?: IFile;
  projectBaseInfo?: IProjectBaseInfo;
  componentRef?: (component: PageControl | null) => void;
}

class PageControl extends BaseComponent<PageControlProps> {
  render() {
    let { activeFile, projectBaseInfo } = this.props;
    if (!activeFile || !projectBaseInfo) {
      return null;
    }
    return <PageEditor activeFile={activeFile} projectBaseInfo={projectBaseInfo} />;
  }
}

function mapStateToProps(state: any): PageControlProps {
  return {
    activeFile: state.projectControl.activeTab || null,
    projectBaseInfo:
      state.projectControl && state.projectControl.projectInfo && state.projectControl.projectInfo.baseInfo
  };
}

function mapDispatchToProps(dispatch: Dispatch): PageControlProps {
  return {
    actions: bindActionCreators({}, dispatch)
  };
}
export default connect<PageControlProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(PageControl);
