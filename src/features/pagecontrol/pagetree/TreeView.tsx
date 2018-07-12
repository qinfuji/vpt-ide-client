import Node from './Node';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import { decorate } from '../decorate';
import { monospace } from './themes/Fonts';
import { List } from 'immutable';
import { Store } from './Store';

type Props = {
  reload?: () => void;
  roots: List<any>;
};

class TreeView extends React.Component<Props> {
  static childContextTypes = {
    scrollTo: PropTypes.func
  };

  static contextTypes = {
    theme: PropTypes.object.isRequired
  };
  node?: HTMLElement | null;

  getChildContext() {
    return {
      scrollTo: this.scrollTo.bind(this)
    };
  }

  scrollTo(toNode) {
    if (!this.node) {
      return;
    }
    var val = 0;
    var height = toNode.offsetHeight;
    while (toNode && this.node.contains(toNode)) {
      val += toNode.offsetTop;
      toNode = toNode.offsetParent;
    }
    var top = this.node.scrollTop;
    var rel = val - this.node.offsetTop;
    var margin = 40;
    if (top > rel - margin) {
      this.node.scrollTop = rel - margin;
    } else if (top + this.node.offsetHeight < rel + height + margin) {
      this.node.scrollTop = rel - this.node.offsetHeight + height + margin;
    }
  }

  render() {
    if (!this.props.roots.count()) {
      return (
        <div style={styles.container}>
          <div ref={n => (this.node = n)} style={styles.scroll}>
            <div style={styles.scrollContents}>
              Waiting for roots to load...
              {this.props.reload && (
                <span>
                  to reload the inspector <button onClick={this.props.reload}> click here</button>
                </span>
              )}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={styles.container}>
        <div ref={n => (this.node = n)} style={styles.scroll}>
          <div style={styles.scrollContents}>
            {this.props.roots.map(id => <Node depth={0} id={id} key={id} />).toJS()}
          </div>
        </div>
      </div>
    );
  }
}

var styles = {
  container: {
    fontFamily: monospace.family,
    fontSize: monospace.sizes.normal,
    lineHeight: 1.3,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minHeight: 0,
    height: '100%',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    userSelect: 'none'
  } as React.CSSProperties,

  scroll: {
    overflow: 'auto',
    minHeight: 0,
    flex: 1,
    display: 'flex',
    alignItems: 'flex-start'
  } as React.CSSProperties,

  scrollContents: {
    flexDirection: 'column',
    flex: 1,
    display: 'flex',
    alignItems: 'stretch'
  } as React.CSSProperties
};

var WrappedTreeView = decorate(
  {
    listeners(props: Props) {
      return ['roots'];
    },
    props(store: Store, props: Props) {
      return {
        roots: store.roots
      };
    }
  },
  TreeView
);

export default WrappedTreeView;
