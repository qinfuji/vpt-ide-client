import * as React from 'react';
import { BaseComponent, createRef } from 'office-ui-fabric-react/lib/Utilities';
import { SplitPane, Pane } from 'vpt-components';
import { IFile, IProjectBaseInfo } from '../../common/types';
//import { Tree, ITreeItem, ITreeMode } from '../common';
import { IEditorProperty, IPageOutlineItem, IPageOutlineItemType } from './types';
import * as styles from './styles/PageEditor.scss';
import Postmate from 'postmate';
import { Panel } from '../common/Panel';
import { ITreeMode, Tree, ITreeItem } from '../common/tree';
import { SelectionMode } from 'office-ui-fabric-react/lib/Selection';

class OutlineMode implements ITreeMode<IPageOutlineItem> {
  private _items: IPageOutlineItem[];

  isLeaf(item: IPageOutlineItem): boolean {
    return item.type == IPageOutlineItemType.NORMAL;
  }
  getItem(index: number): IPageOutlineItem {
    return this._items[index];
  }
  getItemIndex(item: IPageOutlineItem): number {
    return this._items.indexOf(item);
  }
  getRoot(): IPageOutlineItem[] {
    return this._items.filter(item => {
      return item.parent === null || item.parent === undefined;
    });
  }
  getChild(parent: IPageOutlineItem): IPageOutlineItem[] {
    return this._items.filter(item => {
      return item.parent == parent.id;
    });
  }
  isExpanded(item: IPageOutlineItem): boolean {
    return true;
  }
  setItems(items: IPageOutlineItem[]): void {
    this._items = items;
  }
  getId(item: IPageOutlineItem): string {
    return item.id;
  }
  getParent(item: IPageOutlineItem): IPageOutlineItem | null {
    for (let index = 0; index < this._items.length; index++) {
      const element = this._items[index];
      if (element.id == item.parent) {
        return element;
      }
    }
    return null;
  }
}

export interface PageEditorProps {
  activeFile?: IFile;
  projectBaseInfo?: IProjectBaseInfo;
  componentRef?: (component: PageEditor | null) => void;
}

export interface PageEditorState {
  /**
   * 当前页面的outline
   */
  outline?: IPageOutlineItem[] | null;
  /**
   * 当前选择组件的编辑属性列表
   */
  editorProperty?: IEditorProperty[] | null;
  /**
   * 当前选择的组件
   */
  selectedComponent?: IPageOutlineItem | null;
}

export default class PageEditor extends BaseComponent<PageEditorProps, PageEditorState> {
  private _iframeDiv: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  private _handshake: Postmate;
  private _childEditor: any;
  private _outlineMode = new OutlineMode();

  constructor(props: PageEditorProps) {
    super(props);
    this.state = {};
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
      url: 'http://dnd2.vpt.com:4000/children.html?path=' + encodeURIComponent(activeFile.path)
    });

    this._handshake.then(child => {
      console.log('complete handshake');
      this._childEditor = child;
      child.on('pageoutline', this._receivePageOutline);
      child.on('componentSelected', this._receiveChildComponentSelected);
    });

    this.setState({
      outline: null,
      editorProperty: null,
      selectedComponent: null
    });
  }

  private _destoryChild() {
    if (this._childEditor) {
      this._childEditor.destroy();
    }
  }

  componentWillUnmount() {
    this._destoryChild();
  }

  componentWillReceiveProps(newprops: PageEditorProps) {
    if (newprops.activeFile != this.props.activeFile) {
      this._reloadIframe(newprops.activeFile);
    }
  }

  private _receivePageOutline = pageoutline => {
    this.setState({
      outline: pageoutline
    });
  };

  private _receiveChildComponentSelected = selectdComponent => {
    this.setState({
      selectedComponent: selectdComponent
    });
  };

  /**
   *
   */
  private _outlineChanged = (items: IPageOutlineItem[]) => {
    this._childEditor.call('componentSelectChanged', {});
  };

  private _propertyChanged(item: IEditorProperty) {}

  render() {
    let { activeFile } = this.props;
    let { outline, selectedComponent } = this.state;
    if (!activeFile) {
      return null;
    }
    if (selectedComponent) {
      console.log('render selectedComponent', selectedComponent);
      console.log(this._outlineMode.getId(selectedComponent));
    }
    return (
      <div className={styles.root}>
        <SplitPane split="vertical">
          <Pane>
            <div ref={this._iframeDiv} className={styles.iframe} />
          </Pane>
          <Pane initialSize="355px" minSize="220px">
            <SplitPane split="horizontal">
              <Pane initialSize="380px" minSize="220px">
                <Panel title="Pageoutline">
                  <Tree
                    mode={this._outlineMode}
                    visualCheckbox={false}
                    selectedKeys={selectedComponent ? this._outlineMode.getId(selectedComponent) : null}
                    selectionMode={SelectionMode.single}
                    items={(outline as ITreeItem[]) || []}
                    onRenderItem={this._renderOutlineItem}
                    styles={{ root: { margin: '10px 0 0 15px' } }}
                    onSelectChange={this._outlineChanged}
                  />
                </Panel>
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

  private _renderOutlineItem = (item: IPageOutlineItem): React.ReactNode => {
    return <div>{item.name}</div>;
  };
}
