import * as React from 'react';
import * as PropTypes from 'prop-types';
import { BaseComponent, createRef } from 'office-ui-fabric-react/lib/Utilities';
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
export interface PageEditorProps {
  activeFile?: IFile;
  projectBaseInfo?: IProjectBaseInfo;
  componentRef?: (component: PageEditor | null) => void;
}

type State = {
  store?: Store | null;
};

export default class PageEditor extends BaseComponent<PageEditorProps, State> {
  static childContextTypes = {
    pageTreeStore: PropTypes.object,
    theme: PropTypes.object.isRequired
  };

  private _iframeDiv: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  private _handshake: Postmate;
  private _childEditor: any;
  private _bridge: Bridge | null;
  private _themeStore: ThemeStore | null;

  constructor(props: PageEditorProps) {
    super(props);
    this.state = {
      store: null
    };
  }

  getChildContext(): any {
    return {
      pageTreeStore: this.state.store,
      theme: (this._themeStore && this._themeStore.theme) || Themes.Tomorrow
    };
  }

  componentDidMount() {
    let { activeFile } = this.props;
    if (activeFile) {
      this._reloadIframe(activeFile);
    }
  }

  private _reloadIframe(activeFile?: IFile) {
    this._destoryChild();
    if (!activeFile) return;
    this._handshake = new Postmate({
      container: this._iframeDiv.current,
      url: 'http://localhost:8080/?path=' + encodeURIComponent(activeFile.path)
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
    this.setState({
      store: null
    });
    let wall: Wall = {
      listen: fn => {
        this._childEditor.on('message', data => {
          console.log(data);
          fn(data);
        });
      },
      send: (data: PayloadType) => {
        this._childEditor.call('message', data);
      }
    };
    this._bridge = new Bridge(wall);
    this.setState({
      store: new Store(this._bridge)
    });
  }

  private _destoryChild() {
    if (this._childEditor) {
      this._childEditor.destroy();
    }
  }

  componentWillUnmount() {
    this._destoryChild();
    this._childEditor = null;
    this._bridge = null;
    //this._store = null;
  }

  componentWillReceiveProps(newprops: PageEditorProps) {
    if (newprops.activeFile && newprops.activeFile != this.props.activeFile) {
      this._reloadIframe(newprops.activeFile);
    }
  }

  render() {
    let { activeFile } = this.props;
    if (!activeFile) {
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
                <Panel title="Properties" />
              </Pane>
            </SplitPane>
          </Pane>
        </SplitPane>
      </div>
    );
  }
}
