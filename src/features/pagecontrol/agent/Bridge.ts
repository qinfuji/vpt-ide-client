import { consts } from './consts';
import { dehydrate } from './dehydrate';
import { hydrate } from './hydrate';
import { getIn } from './getIn';
const performanceNow = require('fbjs/lib/performanceNow');

function getWindowFunction(name, polyfill): Function {
  if (String(window[name]).indexOf('[native code]') === -1) {
    return polyfill;
  }
  return window[name];
}

// Custom polyfill that runs the queue with a backoff.
// If you change it, make sure it behaves reasonably well in Firefox.
var lastRunTimeMS = 5;
var cancelIdleCallback = getWindowFunction('cancelIdleCallback', clearTimeout);
var requestIdleCallback = getWindowFunction('requestIdleCallback', function(cb, options) {
  // Magic numbers determined by tweaking in Firefox.
  // There is no special meaning to them.
  var delayMS = 3000 * lastRunTimeMS;
  if (delayMS > 500) {
    delayMS = 500;
  }

  return setTimeout(() => {
    var startTime = performanceNow();
    cb({
      didTimeout: false,
      timeRemaining() {
        return Infinity;
      }
    });
    var endTime = performanceNow();
    lastRunTimeMS = (endTime - startTime) / 1000;
  }, delayMS);
});

type AnyFn = (...args: any[]) => any;

type IdleDeadline = {
  didTimeout: boolean;
  timeRemaining: () => number;
};

type EventPayload = {
  type: 'event';
  cleaned?: string[][];
  evt: string;
  data: any;
};

export type PayloadType =
  | {
      type: 'inspect';
      id: string;
      path: string[];
      callback: number;
    }
  | {
      type: 'many-events';
      events: EventPayload[];
    }
  | {
      type: 'call';
      name: string;
      args: any[];
      callback: number;
    }
  | {
      type: 'callback';
      id: number;
      args: any[];
    }
  | {
      type: 'pause';
    }
  | {
      type: 'resume';
    }
  | EventPayload;

export interface Wall {
  listen: (fn: (data: PayloadType) => void) => void;
  send: (data: PayloadType) => void;
}

export class Bridge {
  private _buffer: Array<{ evt: string; data: any }>;
  private _cbs: Map<number, Function>;
  private _cid: number;
  private _inspectables: Map<string, Object>;
  private _listeners: { [key: string]: Array<(data: any) => void> };
  private _flushHandle?: number | null;
  private _wall: Wall;
  private _callers: { [key: string]: AnyFn };
  private _paused: boolean;

  constructor(wall: Wall) {
    this._cbs = new Map();
    this._inspectables = new Map();
    this._cid = 0;
    this._listeners = {};
    this._buffer = [];
    this._flushHandle = null;
    this._callers = {};
    this._paused = false;
    this._wall = wall;

    wall.listen(this._handleMessage.bind(this));
  }

  inspect(id: string, path: Array<string>, cb: (val: any) => any) {
    var _cid = this._cid++;
    this._cbs.set(_cid, (data, cleaned, proto, protoclean) => {
      if (cleaned.length) {
        hydrate(data, cleaned);
      }
      if (proto && protoclean.length) {
        hydrate(proto, protoclean);
      }
      if (proto) {
        data[consts.proto] = proto;
      }
      cb(data);
    });

    this._wall.send({
      type: 'inspect',
      callback: _cid,
      path,
      id
    });
  }

  call(name: string, args: Array<any>, cb: (val: any) => any) {
    var _cid = this._cid++;
    this._cbs.set(_cid, cb);

    this._wall.send({
      type: 'call',
      callback: _cid,
      args,
      name
    });
  }

  onCall(name: string, handler: (data: any) => any) {
    if (this._callers[name]) {
      throw new Error('only one call handler per call name allowed');
    }
    this._callers[name] = handler;
  }

  pause() {
    this._wall.send({
      type: 'pause'
    });
  }

  resume() {
    this._wall.send({
      type: 'resume'
    });
  }

  setInspectable(id: string, data: Object) {
    var prev = this._inspectables.get(id);
    if (!prev) {
      this._inspectables.set(id, data);
      return;
    }
    this._inspectables.set(id, { ...prev, ...data });
  }

  send(evt: string, data?: any) {
    this._buffer.push({ evt, data });
    this.scheduleFlush();
  }

  scheduleFlush() {
    if (!this._flushHandle && this._buffer.length) {
      var timeout = this._paused ? 5000 : 500;
      this._flushHandle = requestIdleCallback(this.flushBufferWhileIdle.bind(this), { timeout });
    }
  }

  cancelFlush() {
    if (this._flushHandle) {
      cancelIdleCallback(this._flushHandle);
      this._flushHandle = null;
    }
  }

  flushBufferWhileIdle(deadline: IdleDeadline) {
    this._flushHandle = null;

    // Magic numbers were determined by tweaking in a heavy UI and seeing
    // what performs reasonably well both when DevTools are hidden and visible.
    // The goal is that we try to catch up but avoid blocking the UI.
    // When paused, it's okay to lag more, but not forever because otherwise
    // when user activates React tab, it will freeze syncing.
    var chunkCount = this._paused ? 20 : 10;
    var chunkSize = Math.round(this._buffer.length / chunkCount);
    var minChunkSize = this._paused ? 50 : 100;

    while (this._buffer.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {
      var take = Math.min(this._buffer.length, Math.max(minChunkSize, chunkSize));
      var currentBuffer = this._buffer.splice(0, take);
      this.flushBufferSlice(currentBuffer);
    }

    if (this._buffer.length) {
      this.scheduleFlush();
    }
  }

  flushBufferSlice(bufferSlice: Array<{ evt: string; data: any }>) {
    var events = bufferSlice.map(({ evt, data }) => {
      var cleaned = [];
      var san = dehydrate(data, cleaned);
      if (cleaned.length) {
        this.setInspectable(data.id, data);
      }
      return { type: 'event', evt, data: san, cleaned } as EventPayload;
    });
    this._wall.send({ type: 'many-events', events });
  }

  forget(id: string) {
    this._inspectables.delete(id);
  }

  on(evt: string, fn: AnyFn) {
    if (!this._listeners[evt]) {
      this._listeners[evt] = [fn];
    } else {
      this._listeners[evt].push(fn);
    }
  }

  off(evt: string, fn: AnyFn) {
    if (!this._listeners[evt]) {
      return;
    }
    var ix = this._listeners[evt].indexOf(fn);
    if (ix !== -1) {
      this._listeners[evt].splice(ix, 1);
    }
  }

  once(evt: string, fn: AnyFn) {
    var self = this;
    var listener = function() {
      fn.apply(this, arguments);
      self.off(evt, listener);
    };
    this.on(evt, listener);
  }

  _handleMessage(payload: PayloadType) {
    if (payload.type === 'resume') {
      this._paused = false;
      this.scheduleFlush();
      return;
    }

    if (payload.type === 'pause') {
      this._paused = true;
      this.cancelFlush();
      return;
    }

    if (payload.type === 'callback') {
      var callback = this._cbs.get(payload.id);
      if (callback) {
        callback(...payload.args);
        this._cbs.delete(payload.id);
      }
      return;
    }

    if (payload.type === 'call') {
      this._handleCall(payload.name, payload.args, payload.callback);
      return;
    }

    if (payload.type === 'inspect') {
      this._inspectResponse(payload.id, payload.path, payload.callback);
      return;
    }

    if (payload.type === 'event') {
      // console.log('[bridge<-]', payload.evt);
      if (payload.cleaned) {
        hydrate(payload.data, payload.cleaned);
      }
      var fns = this._listeners[payload.evt];
      var data = payload.data;
      if (fns) {
        fns.forEach(fn => fn(data));
      }
    }

    if (payload.type === 'many-events') {
      payload.events.forEach(event => {
        // console.log('[bridge<-]', payload.evt);
        if (event.cleaned) {
          hydrate(event.data, event.cleaned);
        }
        var handlers = this._listeners[event.evt];
        if (handlers) {
          handlers.forEach(fn => fn(event.data));
        }
      });
    }
  }

  _handleCall(name: string, args: Array<any>, callback: number) {
    if (!this._callers[name]) {
      console.warn('unknown call: "' + name + '"');
      return;
    }
    args = !Array.isArray(args) ? [args] : args;
    var result;
    try {
      result = this._callers[name].apply(null, args);
    } catch (e) {
      console.error('Failed to call', e);
      return;
    }
    this._wall.send({
      type: 'callback',
      id: callback,
      args: [result]
    });
  }

  _inspectResponse(id: string, path: Array<string>, callback: number) {
    var inspectable = this._inspectables.get(id);
    var result = {};
    var cleaned = [];
    var proto = null;
    var protoclean = [];

    if (inspectable) {
      var val = getIn(inspectable, path);
      var protod = false;
      var isFn = typeof val === 'function';

      if (val && typeof val[Symbol.iterator] === 'function') {
        var iterVal = Object.create({}); // flow throws "object literal incompatible with object type"
        var count = 0;
        for (const entry of val) {
          if (count > 100) {
            // TODO: replace this if block with better logic to handle large iterables
            break;
          }
          iterVal[count] = entry;
          count++;
        }
        val = iterVal;
      }

      Object.getOwnPropertyNames(val).forEach(name => {
        if (name === '__proto__') {
          protod = true;
        }
        if (isFn && (name === 'arguments' || name === 'callee' || name === 'caller')) {
          return;
        }
        // $FlowIgnore This is intentional
        result[name] = dehydrate(val[name], cleaned, [name]);
      });

      /* eslint-disable nodehydrate
      if (!protod && val._dehydrate
        var newProto = {};dehydrate
        var pIsFn = typeof val.__proto__ === 'function';
        Object.getOwnPropertyNames(val.__proto__).forEach(name => {
          if (pIsFn && (name === 'arguments' || name === 'callee' || name === 'caller')) {
            return;
          }
          newProto[name] = dehydrate(val.__proto__[name], protoclean, [name]);
        });
        proto = newProto;
      }
      /* eslint-enable no-proto */
    }

    this._wall.send({
      type: 'callback',
      id: callback,
      args: [result, cleaned, proto, protoclean]
    });
  }
}
