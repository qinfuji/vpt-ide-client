import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect, Dispatch } from 'react-redux';
import { Dialog, DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { createRef } from 'office-ui-fabric-react/lib/Utilities';
import { Overlay } from 'office-ui-fabric-react/lib/Overlay';
import { login } from './redux/login';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

enum LoginStatus {
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  LOGIN_FAILURE
}

interface ILoginProps {
  actions: any;
  loginStatus: LoginStatus | undefined;
}

interface ILoginState {}

class Login extends React.Component<ILoginProps, ILoginState> {
  private _username = createRef<TextField>();
  private _password = createRef<TextField>();
  private _usernameErr: string | undefined;
  private _passwordErr: string | undefined;
  constructor(props: ILoginProps) {
    super(props);
  }

  handLogin() {
    let username = this._username.value;
    let password = this._password.value;
    if (!username) {
      this.state = {
        usernameErr: 'username is required'
      };
      return;
    }
    if (!password) {
      this.state = {
        passwordErr: 'apssword is required'
      };
      return;
    }
    let { login } = this.props.actions;
    login(username, password);
  }

  render() {
    let { loginStatus } = this.props;
    return (
      <Dialog
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: '登录'
        }}
        hidden={false}
        modalProps={{
          isBlocking: false,
          containerClassName: 'ms-dialogMainOverride'
        }}
      >
        <div>
          {loginStatus === LoginStatus.LOGIN_BEGIN && (
            <Overlay>
              <Spinner size={SpinnerSize.medium} />
            </Overlay>
          )}
          <TextField
            componentRef={this._username}
            errorMessage={this._usernameErr}
            label="用户名"
            required
            type="text"
          />
          <TextField
            componentRef={this._password}
            errorMessage={this._passwordErr}
            label="密码"
            required
            type="password"
          />
        </div>
        <div>
          <PrimaryButton onClick={this.handLogin.bind(this)} text="登录" />
        </div>
      </Dialog>
    );
  }
}

function mapStateToProps(state: any) {
  return {
    loginStatus: state.app.loginStatus as LoginStatus
  };
}

function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators({ login }, dispatch)
  };
}
export default connect<any, any>(
  mapStateToProps,
  mapDispatchToProps
)(Login);
