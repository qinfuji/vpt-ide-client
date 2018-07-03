import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { setUser } from './redux/actions';
import TopMenu from './TopMenu';
import Login from './Login';
import * as styles from './styles/App.scss';
import SelectProject from '../selectproject/SelectProject';

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
          <TopMenu />
          <div className={styles.appWorkspace}>{this.props.children}</div>
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
