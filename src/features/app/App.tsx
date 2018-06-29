import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { setUser } from './redux/actions';
import TopMenu from './TopMenu';
import ProjectControl from '../projectcontrol/ProjectControl';
import Login from './Login';
import * as styles from './styles/App.scss';
import SelectProject from '../selectproject/SelectProject';
import { SplitPane, Pane } from 'vpt-components';
import PageControl from '../pagecontrol/PageControl';
import { Tabs } from '../common/Tabs';

export interface IAppProps {
  actions: object;
  children: React.ReactNode;
  userInfo?: object;
}

export class App extends React.Component<IAppProps, {}> {
  constructor(props: IAppProps) {
    super(props);
  }

  renderLoading() {
    return (
      <div className="home-app loading">
        <span style={{ marginLeft: 20 }}>Loading...</span>
      </div>
    );
  }

  render() {
    let { userInfo } = this.props;

    if (!userInfo) {
      return <Login />;
    } else {
      return (
        <div className={styles.root + ' home-app'}>
          <SplitPane split="vertical">
            <Pane initialSize="220px" minSize="220px">
              <div className={styles.appToolbar}>
                <TopMenu />
              </div>
              <div className={styles.appWorkspace}>
                <ProjectControl />
              </div>
            </Pane>
            <Pane>
              <Tabs />
              {/* {<PageControl />} */}
              {this.props.children}
            </Pane>
          </SplitPane>
          <SelectProject />
        </div>
      );
    }
  }
}

function mapStateToProps(state: any) {
  return {
    userInfo: state.app.userInfo
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
    actions: bindActionCreators({ setUser }, dispatch)
  };
}

export default connect<any, any, App>(
  mapStateToProps,
  mapDispatchToProps
)(App);
