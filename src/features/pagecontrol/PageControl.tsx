import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { BaseComponent } from 'office-ui-fabric-react/lib/Utilities';
import { IFile, IProjectBaseInfo } from '../../common/types';
import PageEditor from './PageEditor';

export interface PageControlProps {
  actions?: any;
  activedFile?: IFile;
  projectBaseInfo?: IProjectBaseInfo;
  componentRef?: (component: PageControl | null) => void;
}

class PageControl extends BaseComponent<PageControlProps> {
  render() {
    let { activedFile, projectBaseInfo } = this.props;
    console.log(this.props);
    if (!activedFile || !projectBaseInfo) {
      return null;
    }
    return <PageEditor activeFile={activedFile} projectBaseInfo={projectBaseInfo} />;
  }
}

function mapStateToProps(state: any): PageControlProps {
  return {
    activedFile: state.projectControl.activedFile || null,
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
