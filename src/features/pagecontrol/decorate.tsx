'use strict';

import * as PropTypes from 'prop-types';
import * as React from 'react';

type Options = {
  shouldUpdate?: (nextProps: Object, props: Object) => boolean;
  listeners?: (props: Object, store: Object) => Array<string>;
  props: (store: Object, props: Object) => Object;
  store?: string;
};

type State = {};

export function decorate(options: Options, Component: any): any {
  var storeKey = options.store || 'pageTreeStore';
  class Wrapper extends React.Component<{}, State> {
    static contextTypes = {
      [storeKey]: PropTypes.object
    };
    static displayName = 'Wrapper(' + Component.name + ')';

    private _listeners: Array<string>;
    private _update: () => void;
    state: State;
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentWillMount() {
      if (!this.context[storeKey]) {
        console.warn('no store on context...');
        return;
      }
      this._update = () => this.forceUpdate();
      if (!options.listeners) {
        return;
      }
      this._listeners = options.listeners(this.props, this.context[storeKey]);
      this._listeners.forEach(evt => {
        this.context[storeKey].on(evt, this._update);
      });
    }

    componentWillUnmount() {
      if (!this.context[storeKey]) {
        console.warn('no store on context...');
        return;
      }
      this._listeners.forEach(evt => {
        this.context[storeKey].off(evt, this._update);
      });
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (nextState !== this.state) {
        return true;
      }
      if (options.shouldUpdate) {
        return options.shouldUpdate(nextProps, this.props);
      }
      return false;
    }

    componentWillUpdate(nextProps, nextState) {
      if (!this.context[storeKey]) {
        console.warn('no store on context...');
        return;
      }
      if (!options.listeners) {
        return;
      }
      var listeners = options.listeners(this.props, this.context[storeKey]);
      var diff = arrayDiff(listeners, this._listeners);
      diff.missing.forEach(name => {
        this.context[storeKey].off(name, this._update);
      });
      diff.newItems.forEach(name => {
        this.context[storeKey].on(name, this._update);
      });
      this._listeners = listeners;
    }

    render() {
      var store = this.context[storeKey];
      var props = store && options.props(store, this.props);
      return <Component {...props} {...this.props} />;
    }
  }

  return Wrapper;
}

function arrayDiff(array, oldArray: any) {
  var names = new Set();
  var missing = [] as any;
  for (var i = 0; i < array.length; i++) {
    names.add(array[i]);
  }
  for (var j = 0; j < oldArray.length; j++) {
    if (!names.has(oldArray[j])) {
      missing.push(oldArray[j]);
    } else {
      names.delete(oldArray[j]);
    }
  }
  return {
    missing,
    newItems: setToArray(names)
  };
}

function setToArray(set) {
  var res = [] as any;
  for (var val of set) {
    res.push(val);
  }
  return res;
}
