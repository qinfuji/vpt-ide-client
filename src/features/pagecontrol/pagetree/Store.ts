import { EventEmitter } from 'events';
import { Map, Set, List } from 'immutable';
import { Bridge } from '../agent/Bridge';
import { DOMEvent, ElementID } from './types';

type ListenerFunction = () => void;
type DataType = { [key: string]: any };

type ContextMenu = {
  type: string;
  x: number;
  y: number;
  args: Array<any>;
};

export class Store extends EventEmitter {
  private _bridge: Bridge;
  private _nodes: Map<string, any>;
  _parents: Map<ElementID, ElementID>;
  private _nodesByName: Map<string, Set<ElementID>>;
  private _eventQueue: Array<string>;
  private _eventTimer?: any;

  contextMenu?: ContextMenu | null;
  hovered?: ElementID | null;
  isBottomTagHovered: boolean;
  isBottomTagSelected: boolean;
  breadcrumbHead?: ElementID | null;
  roots: List<any>;
  selected?: ElementID | null;

  constructor(bridge: Bridge) {
    super();
    this._bridge = bridge;
    this._nodes = Map();
    this._parents = Map();
    this._nodesByName = Map();
    this.roots = List();
    this.hovered = null;
    this.selected = null;
    this.contextMenu = null;
    this.isBottomTagHovered = false;
    this.isBottomTagSelected = false;
    this._eventQueue = [];

    this._bridge.on('root', id => {
      if (this.roots.contains(id)) {
        return;
      }
      this.roots = this.roots.push(id);
      if (!this.selected) {
        this.selected = this.skipWrapper(id);
        this.emit('selected');
        this._bridge.send('selected', this.selected);
      }
      this.emit('roots');
    });
    this._bridge.on('mount', data => this._mountComponent(data));
    this._bridge.on('update', data => this._updateComponent(data));
    this._bridge.on('unmount', id => this._unmountComponent(id));

    //this._bridge.on('setInspectEnabled', data => this.setInspectEnabled(data));
    this._bridge.on('select', ({ id, quiet, offsetFromLeaf = 0 }) => {
      // Backtrack if we want to skip leaf nodes
      while (offsetFromLeaf > 0) {
        offsetFromLeaf--;
        var pid = this._parents.get(id);
        if (pid) {
          id = pid;
        } else {
          break;
        }
      }
      this._revealDeep(id);
      this.selectTop(this.skipWrapper(id), quiet);
    });

    this._establishConnection();
    this._eventQueue = [];
    this._eventTimer = null;
  }

  emit(event: string): boolean {
    if (this._eventQueue.indexOf(event) !== -1) {
      // to appease flow
      return true;
    }
    this._eventQueue.push(event);
    if (!this._eventTimer) {
      this._eventTimer = setTimeout(() => this.flush(), 50);
    }
    return true;
  }

  flush() {
    if (this._eventTimer) {
      clearTimeout(this._eventTimer);
      this._eventTimer = null;
    }
    this._eventQueue.forEach(evt => {
      EventEmitter.prototype.emit.call(this, evt);
    });
    this._eventQueue = [];
  }

  skipWrapper(id: ElementID, up?: boolean, end?: boolean): ElementID | undefined {
    if (!id) {
      return undefined;
    }
    while (true) {
      var node = this.get(id);
      var nodeType = node.get('nodeType');

      if (nodeType !== 'Wrapper' && nodeType !== 'Native') {
        return id;
      }
      if (nodeType === 'Native' && (!up || this.get(this._parents.get(id)).get('nodeType') !== 'NativeWrapper')) {
        return id;
      }
      if (up) {
        var parentId = this._parents.get(id);
        if (!parentId) {
          // Don't show the Stack root wrapper in breadcrumbs
          return undefined;
        }
        id = parentId;
      } else {
        var children = node.get('children');
        if (children.length === 0) {
          return undefined;
        }
        var index = end ? children.length - 1 : 0;
        var childId = children[index];
        id = childId;
      }
    }
  }

  get(id: ElementID): DataType {
    return this._nodes.get(id);
  }

  getParent(id: ElementID): ElementID {
    return this._parents.get(id);
  }

  _mountComponent(data: DataType) {
    var map = Map(data).set('renders', 1);
    if (data.nodeType === 'Composite') {
      map = map.set('collapsed', true);
    }
    this._nodes = this._nodes.set(data.id, map);
    if (data.children && data.children.forEach) {
      data.children.forEach(cid => {
        this._parents = this._parents.set(cid, data.id);
      });
    }
    var curNodes = this._nodesByName.get(data.name) || Set();
    this._nodesByName = this._nodesByName.set(data.name, curNodes.add(data.id));
    this.emit(data.id);
  }

  _updateComponent(data: DataType) {
    var node = this.get(data.id);
    if (!node) {
      return;
    }
    data.renders = node.get('renders') + 1;
    this._nodes = this._nodes.mergeIn([data.id], Map(data));
    if (data.children && data.children.forEach) {
      data.children.forEach(cid => {
        if (!this._parents.get(cid)) {
          this._parents = this._parents.set(cid, data.id);
        }
      });
    }
    this.emit(data.id);
  }

  _unmountComponent(id: ElementID) {
    var pid = this._parents.get(id);
    this._removeFromNodesByName(id);
    this._parents = this._parents.delete(id);
    this._nodes = this._nodes.delete(id);
    if (pid) {
      this.emit(pid);
    } else {
      var ix = this.roots.indexOf(id);
      if (ix !== -1) {
        this.roots = this.roots.delete(ix);
        this.emit('roots');
      }
    }
  }

  _removeFromNodesByName(id: ElementID) {
    var node = this._nodes.get(id);
    if (node) {
      this._nodesByName = this._nodesByName.set(node.get('name'), this._nodesByName.get(node.get('name')).delete(id));
    }
  }

  scrollToNode(id: ElementID): void {
    this._bridge.send('scrollToNode', id);
  }

  private _toggleDeepChildren(id: ElementID, value: boolean) {
    var node = this._nodes.get(id);
    if (!node) {
      return;
    }
    if (node.get('collapsed') !== value) {
      this._nodes = this._nodes.setIn([id, 'collapsed'], value);
      this.emit(id);
    }
    var children = node.get('children');
    if (children && children.forEach) {
      children.forEach(cid => this._toggleDeepChildren(cid, value));
    }
  }

  off(evt: string, fn: ListenerFunction): void {
    this.removeListener(evt, fn);
  }

  setHover(id: ElementID, isHovered: boolean, isBottomTag: boolean) {
    if (isHovered) {
      var old = this.hovered;
      this.hovered = id;
      this.isBottomTagHovered = isBottomTag;
      if (old) {
        this.emit(old);
      }
      this.emit(id);
      this.emit('hover');
      this.highlight(id);
    } else if (this.hovered === id) {
      this.hideHighlight();
      this.isBottomTagHovered = false;
    }
  }

  highlight(id: string): void {
    this._bridge.send('highlight', id);
  }

  hideHighlight() {
    this._bridge.send('hideHighlight');
    if (!this.hovered) {
      return;
    }
    var id = this.hovered;
    this.hovered = null;
    this.emit(id);
    this.emit('hover');
  }

  selectTop(id?: ElementID, noHighlight?: boolean) {
    this.isBottomTagSelected = false;
    this.select(id, noHighlight);
  }

  select(id?: ElementID, noHighlight?: boolean, keepBreadcrumb?: boolean) {
    var oldSel = this.selected;
    this.selected = id;
    if (oldSel) {
      this.emit(oldSel);
    }
    if (id) {
      this.emit(id);
    }
    if (!keepBreadcrumb) {
      this.breadcrumbHead = id;
      this.emit('breadcrumbHead');
    }
    this.emit('selected');
    this._bridge.send('selected', id);
    if (!noHighlight && id) {
      this.highlight(id);
    }
  }

  selectBottom(id: ElementID) {
    this.isBottomTagSelected = true;
    this.select(id);
  }

  showContextMenu(type: string, evt: DOMEvent, ...args: Array<any>) {
    evt.preventDefault();
    this.contextMenu = { type, x: evt.pageX, y: evt.pageY, args };
    this.emit('contextMenu');
  }

  toggleCollapse(id: ElementID) {
    this._nodes = this._nodes.updateIn([id, 'collapsed'], c => !c);
    this.emit(id);
  }

  toggleAllChildrenNodes(value: boolean) {
    var id = this.selected;
    if (!id) {
      return;
    }
    this._toggleDeepChildren(id, value);
  }

  _establishConnection() {
    var tries = 0;
    var requestInt;
    this._bridge.once('capabilities', capabilities => {
      clearInterval(requestInt);
      this.emit('connected');
    });
    this._bridge.send('requestCapabilities');
    requestInt = setInterval(() => {
      tries += 1;
      if (tries > 100) {
        console.error('failed to connect');
        clearInterval(requestInt);
        this.emit('connection failed');
        return;
      }
      this._bridge.send('requestCapabilities');
    }, 500);
  }

  _revealDeep(id: ElementID) {
    var pid = this._parents.get(id);
    while (pid) {
      if (this._nodes.getIn([pid, 'collapsed'])) {
        this._nodes = this._nodes.setIn([pid, 'collapsed'], false);
        this.emit(pid);
      }

      pid = this._parents.get(pid);
    }
  }
}
