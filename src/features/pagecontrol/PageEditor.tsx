import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import * as PropTypes from 'prop-types';
import { SplitPane, Pane } from 'vpt-components';
import { IFile, IProjectBaseInfo } from '../../common/types';
import * as styles from './styles/PageEditor.scss';
import Postmate from 'postmate';
import { Panel } from '../common/Panel';
import { Bridge, Wall, PayloadType } from './agent/Bridge';
import { Store } from './pagetree/Store';
import { Store as ThemeStore } from './pagetree/themes/Store';
import * as Themes from './pagetree/themes/Themes';
import TreeView from './pagetree/TreeView';
import { keyboardNav } from './pagetree/keyboardNav';
import { PropertiesEditor } from './propseditor';
import { fetchComponentEditInfo } from './propseditor/redux/fetchComponentEditInfo';
export interface PageEditorProps {
  activedFile?: IFile;
  projectBaseInfo?: IProjectBaseInfo;
  actions?: any;
}

type State = {
  store?: Store | null;
};

export class PageEditor extends React.Component<PageEditorProps, State> {
  static childContextTypes = {
    pageTreeStore: PropTypes.object,
    theme: PropTypes.object.isRequired,
    activedFile: PropTypes.object.isRequired,
    projectBaseInfo: PropTypes.object.isRequired
  };

  private _iframeDiv: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  private _handshake: Postmate;
  private _childEditor: any;
  private _bridge: Bridge | null;
  private _themeStore: ThemeStore | null;
  private _keyListener: (e: React.KeyboardEvent) => void;

  constructor(props: PageEditorProps) {
    super(props);
    this.state = {
      store: null
    };
  }

  getChildContext(): any {
    return {
      pageTreeStore: this.state.store,
      theme: (this._themeStore && this._themeStore.theme) || Themes.Tomorrow,
      activedFile: this.props.activedFile,
      projectBaseInfo: this.props.projectBaseInfo
    };
  }

  componentDidMount() {
    let { activedFile } = this.props;
    if (activedFile) {
      this._reloadIframe(activedFile);
    }
  }

  private _reloadIframe(activedFile?: IFile) {
    this._destoryChild();
    if (!activedFile) return;
    this._handshake = new Postmate({
      container: this._iframeDiv.current,
      url: 'http://localhost:8080/?path=' + encodeURIComponent(activedFile.path)
    });

    this._handshake.then(child => {
      this._childEditor = child;
      child.on('childReady', () => {
        console.log('receive childready');
        this._createDevTool(child);
      });
    });
  }

  private _createDevTool(child) {
    if (this._keyListener) {
      window.removeEventListener('keydown', this._keyListener as any);
    }
    this.setState({
      store: null
    });
    let wall: Wall = {
      listen: fn => {
        this._childEditor.on('message', data => {
          fn(data);
        });
      },
      send: (data: PayloadType) => {
        this._childEditor.call('message', data);
      }
    };
    this._bridge = new Bridge(wall);
    let _store = new Store(this._bridge);
    this._keyListener = keyboardNav(_store, window);
    window.addEventListener('keydown', this._keyListener as any);
    _store.on('selected', () => {
      this._loadSleectedComponent();
    });
    this.setState({
      store: _store
    });
  }

  private _destoryChild() {
    if (this._childEditor) {
      this._childEditor.destroy();
    }
  }

  private _loadSleectedComponent() {
    let { store } = this.state;
    let { fetchComponentEditInfo } = this.props.actions;
    if (store) {
      let selected = store.selected;
      if (selected) {
        fetchComponentEditInfo(store.get(selected));
      }
    }
  }

  componentWillUnmount() {
    this._destoryChild();
    this._childEditor = null;
    this._bridge = null;
    if (this._keyListener) {
      window.removeEventListener('keydown', this._keyListener as any);
    }
  }

  componentWillReceiveProps(newprops: PageEditorProps) {
    if (newprops.activedFile && newprops.activedFile != this.props.activedFile) {
      this._reloadIframe(newprops.activedFile);
    }
  }

  render() {
    let { activedFile } = this.props;
    if (!activedFile) {
      return null;
    }
    let { store } = this.state;
    return (
      <div className={styles.root}>
        <SplitPane split="vertical">
          <Pane>
            <div ref={this._iframeDiv} className={styles.iframe} />
          </Pane>
          <Pane initialSize="355px" minSize="220px">
            <SplitPane split="horizontal">
              <Pane initialSize="380px" minSize="220px">
                <Panel title="Pageoutline">{store && <TreeView />}</Panel>
              </Pane>
              <Pane>
                <Panel title="Properties">{store && <PropertiesEditor />}</Panel>
              </Pane>
            </SplitPane>
          </Pane>
        </SplitPane>
      </div>
    );
  }
}

function mapStateToProps(state: any): PageEditorProps {
  return {
    activedFile: state.projectControl.activedFile || null,
    projectBaseInfo:
      state.projectControl && state.projectControl.projectInfo && state.projectControl.projectInfo.baseInfo
  };
}

function mapDispatchToProps(dispatch: Dispatch): PageEditorProps {
  return {
    actions: bindActionCreators({ fetchComponentEditInfo }, dispatch)
  };
}
export default connect<PageEditorProps, {}>(
  mapStateToProps,
  mapDispatchToProps
)(PageEditor);
