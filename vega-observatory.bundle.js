(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
 global.VegaObservatory = require('./index.js');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./index.js":2}],2:[function(require,module,exports){
module.exports = require('./vega-observatory.js')

},{"./vega-observatory.js":6}],3:[function(require,module,exports){
module.exports = require('./vega-client').VegaClient;

},{"./vega-client":4}],4:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (typeof exports !== "undefined" && exports !== null ? exports : window).VegaClient = (function() {
    VegaClient.send = function(websocket, message) {
      var sendMessage;
      message = JSON.stringify(message);
      sendMessage = (function(_this) {
        return function() {
          return websocket.send(message);
        };
      })(this);
      if (websocket.readyState === websocket.CONNECTING) {
        return websocket.onopen = sendMessage;
      } else {
        return sendMessage();
      }
    };

    function VegaClient(url, roomId, badge) {
      this.url = url;
      this.roomId = roomId;
      this.badge = badge;
      this.onmessage = __bind(this.onmessage, this);
      if (this.url === void 0) {
        throw new TypeError('url not provided');
      }
      if (this.roomId === void 0) {
        throw new TypeError('roomId not provided');
      }
      if (this.badge === void 0) {
        throw new TypeError('badge not provided');
      }
      this.websocket = new WebSocket(this.url);
      this.callbacks = {};
      this.websocket.onmessage = this.onmessage;
    }

    VegaClient.prototype.onmessage = function(message) {
      var data, parsedMessage, payload, type;
      parsedMessage = JSON.parse(message);
      data = parsedMessage.data;
      type = data.type;
      payload = data.payload;
      return this.trigger(type, payload);
    };

    VegaClient.prototype.on = function(type, callback) {
      var _base;
      (_base = this.callbacks)[type] || (_base[type] = []);
      return this.callbacks[type].push(callback);
    };

    VegaClient.prototype.trigger = function(type, payload) {
      if (!this.callbacks[type]) {
        return;
      }
      return this.callbacks[type].forEach((function(_this) {
        return function(callback, idx, callbacks) {
          return callback.apply(_this, [payload]);
        };
      })(this));
    };

    VegaClient.prototype.call = function() {
      return VegaClient.send(this.websocket, {
        type: 'call',
        payload: {
          roomId: this.roomId,
          badge: this.badge
        }
      });
    };

    VegaClient.prototype.offer = function(offer, peerId) {
      return VegaClient.send(this.websocket, {
        type: 'offer',
        payload: {
          offer: offer,
          peerId: peerId
        }
      });
    };

    VegaClient.prototype.answer = function(answer, peerId) {
      return VegaClient.send(this.websocket, {
        type: 'answer',
        payload: {
          answer: answer,
          peerId: peerId
        }
      });
    };

    VegaClient.prototype.candidate = function(candidate, peerId) {
      return VegaClient.send(this.websocket, {
        type: 'candidate',
        payload: {
          candidate: candidate,
          peerId: peerId
        }
      });
    };

    VegaClient.prototype.hangUp = function() {
      return VegaClient.send(this.websocket, {
        type: 'hangUp',
        payload: {}
      });
    };

    return VegaClient;

  })();

}).call(this);

},{}],5:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var PeerConnectionFactory;

  PeerConnectionFactory = (function() {
    function PeerConnectionFactory() {}

    PeerConnectionFactory.create = function() {};

    return PeerConnectionFactory;

  })();

  module.exports = PeerConnectionFactory;

}).call(this);

},{}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var PeerConnectionFactory, VegaClient, VegaObservatory,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  VegaClient = require('vega-client');

  PeerConnectionFactory = require('./private/peer-connection-factory');

  VegaObservatory = (function() {
    function VegaObservatory(options) {
      this.options = options;
      this._handleOffer = __bind(this._handleOffer, this);
      this._handleCallAccepted = __bind(this._handleCallAccepted, this);
      this.vegaClient = new VegaClient(this.options.url, this.options.roomId, this.options.badge);
      this.peerConnectionFactory = PeerConnectionFactory;
      this.callbacks = {};
      this.peerStore = {};
      this._setClientCallbacks();
    }

    VegaObservatory.prototype.call = function() {
      return this.vegaClient.call();
    };

    VegaObservatory.prototype.on = function(event, callback) {
      var _base;
      (_base = this.callbacks)[event] || (_base[event] = []);
      return this.callbacks[event].push(callback);
    };

    VegaObservatory.prototype.trigger = function(event) {
      var args, callbacks;
      args = Array.prototype.slice.call(arguments, 1);
      if (callbacks = this.callbacks[event]) {
        return callbacks.forEach(function(callback) {
          return callback.apply(this, args);
        });
      }
    };

    VegaObservatory.prototype._setClientCallbacks = function() {
      this.vegaClient.on('callAccepted', (function(_this) {
        return function(payload) {
          return _this._handleCallAccepted(payload);
        };
      })(this));
      return this.vegaClient.on('offer', (function(_this) {
        return function(payload) {
          return _this._handleOffer(payload);
        };
      })(this));
    };

    VegaObservatory.prototype._handleCallAccepted = function(peers) {
      peers.forEach((function(_this) {
        return function(peer) {
          return _this._addPeerToStore(peer);
        };
      })(this));
      return this.trigger('callAccepted', peers);
    };

    VegaObservatory.prototype._handleOffer = function(payload) {
      var peerConnection, sessionDescription;
      peerConnection = this._addPeerToStore(payload);
      sessionDescription = new RTCSessionDescription(payload.offer);
      peerConnection.setRemoteDescription(sessionDescription);
      return this.trigger('offer', payload);
    };

    VegaObservatory.prototype._addPeerToStore = function(peer) {
      var peerConnection;
      peerConnection = this.peerConnectionFactory.create();
      this.peerStore[peer.peerId] = {
        badge: peer.badge,
        peerConnection: peerConnection
      };
      return peerConnection;
    };

    return VegaObservatory;

  })();

  module.exports = VegaObservatory;

}).call(this);

},{"./private/peer-connection-factory":5,"vega-client":3}]},{},[1]);
