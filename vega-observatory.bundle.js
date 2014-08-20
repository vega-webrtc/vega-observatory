(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
 global.VegaObservatory = require('./index.js');

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./index.js":2}],2:[function(require,module,exports){
module.exports = require('./vega-observatory.js')

},{"./vega-observatory.js":8}],3:[function(require,module,exports){
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

    PeerConnectionFactory.create = function(observatory, peer, config, pcConstructor) {
      var peerCandidate, peerId;
      if (pcConstructor == null) {
        pcConstructor = RTCPeerConnection;
      }
      peerCandidate = new pcConstructor(config);
      peerId = peer.peerId;
      peerCandidate.onicecandidate = function(event) {
        var candidate;
        if (candidate = event.candidate) {
          return observatory.sendCandidate(candidate, peerId);
        }
      };
      peerCandidate.onaddstream = function(event) {
        return observatory.trigger('remoteStreamAdded', peer, event.stream);
      };
      return peerCandidate;
    };

    return PeerConnectionFactory;

  })();

  module.exports = PeerConnectionFactory;

}).call(this);

},{}],6:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var PeerStore;

  PeerStore = (function() {
    function PeerStore() {}

    PeerStore.prototype.callbacks = {};

    PeerStore.prototype.peers = [];

    PeerStore.prototype.add = function(peer) {
      this.peers.push(peer);
      return this.trigger('add', peer);
    };

    PeerStore.prototype.addStream = function(peerId, stream) {
      var thePeer;
      thePeer = null;
      this.peers.forEach(function(peer) {
        if (peer.peerId === peerId) {
          return thePeer = peer;
        }
      });
      thePeer.stream = stream;
      return this.trigger('streamAdded', thePeer);
    };

    PeerStore.prototype.remove = function(peerId) {
      var newPeers, removedPeer;
      removedPeer = null;
      newPeers = [];
      this.peers.forEach(function(peer) {
        if (peer.peerId === peerId) {
          return removedPeer = peer;
        } else {
          return newPeers.push(peer);
        }
      });
      this.peers = newPeers;
      return this.trigger('remove', removedPeer);
    };

    PeerStore.prototype.find = function(peerId) {
      var foundPeer;
      foundPeer = void 0;
      this.peers.forEach(function(peer) {
        if (peer.peerId === peerId) {
          return foundPeer = peer;
        }
      });
      return foundPeer;
    };

    PeerStore.prototype.peersWithStreams = function() {
      var peersWithStreams;
      peersWithStreams = [];
      this.peers.forEach((function(_this) {
        return function(peer) {
          if (_this._hasStream(peer)) {
            return peersWithStreams.push(peer);
          }
        };
      })(this));
      return peersWithStreams;
    };

    PeerStore.prototype.peersWithoutStreams = function() {
      var peersWithoutStreams;
      peersWithoutStreams = [];
      this.peers.forEach((function(_this) {
        return function(peer) {
          if (!_this._hasStream(peer)) {
            return peersWithoutStreams.push(peer);
          }
        };
      })(this));
      return peersWithoutStreams;
    };

    PeerStore.prototype.on = function(event, callback) {
      var _base;
      (_base = this.callbacks)[event] || (_base[event] = []);
      return this.callbacks[event].push(callback);
    };

    PeerStore.prototype.trigger = function(event) {
      var args, callbacks;
      args = Array.prototype.slice.call(arguments, 1);
      if (callbacks = this.callbacks[event]) {
        return callbacks.forEach(function(callback) {
          return callback.apply(this, args);
        });
      }
    };

    PeerStore.prototype._hasStream = function(peer) {
      return !!peer.stream;
    };

    return PeerStore;

  })();

  module.exports = PeerStore;

}).call(this);

},{}],7:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var SessionDescriptionCreator;

  SessionDescriptionCreator = (function() {
    SessionDescriptionCreator.forOffer = function(observatory, peerId, peerConnection) {
      var creator;
      creator = new SessionDescriptionCreator(observatory, peerId, peerConnection);
      return creator.forOffer();
    };

    SessionDescriptionCreator.forAnswer = function(observatory, peerId, peerConnection) {
      var creator;
      creator = new SessionDescriptionCreator(observatory, peerId, peerConnection);
      return creator.forAnswer();
    };

    function SessionDescriptionCreator(observatory, peerId, peerConnection) {
      this.observatory = observatory;
      this.peerId = peerId;
      this.peerConnection = peerConnection;
    }

    SessionDescriptionCreator.prototype.forOffer = function() {
      return this.peerConnection.createOffer(this.successCallback(this.sendOffer), this.failureCallback);
    };

    SessionDescriptionCreator.prototype.forAnswer = function(observatory, peerId, peerConnection) {
      return this.peerConnection.createAnswer(this.successCallback(this.sendAnswer), this.failureCallback);
    };

    SessionDescriptionCreator.prototype.successCallback = function(onLocalDescriptionSuccess) {
      return (function(_this) {
        return function(description) {
          return _this.peerConnection.setLocalDescription(description, onLocalDescriptionSuccess, _this.failureCallback);
        };
      })(this);
    };

    SessionDescriptionCreator.prototype.failureCallback = function(error) {
      return console.error(error);
    };

    SessionDescriptionCreator.prototype.sendOffer = function() {
      return this.observatory.sendOffer(this.peerConnection.localDescription, this.peerId);
    };

    SessionDescriptionCreator.prototype.sendAnswer = function() {
      return this.observatory.sendAnswer(this.peerConnection.localDescription, this.peerId);
    };

    return SessionDescriptionCreator;

  })();

  module.exports = SessionDescriptionCreator;

}).call(this);

},{}],8:[function(require,module,exports){
// Generated by CoffeeScript 1.7.1
(function() {
  var PeerConnectionFactory, PeerStore, SessionDescriptionCreator, VegaClient, VegaObservatory, WebRTCInterop;

  VegaClient = require('vega-client');

  PeerConnectionFactory = require('./private/peer-connection-factory');

  SessionDescriptionCreator = require('./private/session-description-creator');

  PeerStore = require('./private/peer-store');

  WebRTCInterop = require('../webrtc-interop/webrtc-interop.js');

  VegaObservatory = (function() {
    function VegaObservatory(options) {
      this.options = options;
      this.vegaClient = new VegaClient(this.options.url, this.options.roomId, this.options.badge);
      this.peerConnectionFactory = this.options.peerConnectionFactory || PeerConnectionFactory;
      this.sessionDescriptionCreator = this.options.sessionDescriptionCreator || SessionDescriptionCreator;
      this.webRTCInterop = this.options.webRTCInterop || WebRTCInterop;
      this.callbacks = {};
      this.peerStore = this.options.peerStore || new PeerStore;
      this.webRTCInterop.infectGlobal();
      this._setClientCallbacks();
    }

    VegaObservatory.prototype.call = function() {
      return this.vegaClient.call();
    };

    VegaObservatory.prototype.sendOffer = function(offer, peerId) {
      return this.vegaClient.offer(offer, peerId);
    };

    VegaObservatory.prototype.sendAnswer = function(answer, peerId) {
      return this.vegaClient.answer(answer, peerId);
    };

    VegaObservatory.prototype.sendCandidate = function(candidate, peerId) {
      return this.vegaClient.candidate(candidate, peerId);
    };

    VegaObservatory.prototype.hangUp = function() {
      return this.vegaClient.hangUp();
    };

    VegaObservatory.prototype.createOffer = function(peerId) {
      var peerConnection;
      peerConnection = this._peerConnection(peerId);
      return this.sessionDescriptionCreator.forOffer(this, peerId, peerConnection);
    };

    VegaObservatory.prototype.createAnswer = function(peerId) {
      var peerConnection;
      peerConnection = this._peerConnection(peerId);
      return this.sessionDescriptionCreator.forAnswer(this, peerId, peerConnection);
    };

    VegaObservatory.prototype._setClientCallbacks = function() {
      this.vegaClient.on('callAccepted', (function(_this) {
        return function(payload) {
          return _this._handleCallAccepted(payload);
        };
      })(this));
      this.vegaClient.on('offer', (function(_this) {
        return function(payload) {
          return _this._handleOffer(payload);
        };
      })(this));
      this.vegaClient.on('answer', (function(_this) {
        return function(payload) {
          return _this._handleAnswer(payload);
        };
      })(this));
      this.vegaClient.on('candidate', (function(_this) {
        return function(payload) {
          return _this._handleCandidate(payload);
        };
      })(this));
      return this.vegaClient.on('peerHangUp', (function(_this) {
        return function(payload) {
          return _this._handlePeerHangUp(payload);
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
      var peer, peerConnection;
      peer = new Object(payload);
      peer.offer = void 0;
      peerConnection = this._addPeerToStore(payload);
      return this._handleSessionDescription(peerConnection, 'offer', payload);
    };

    VegaObservatory.prototype._handleAnswer = function(payload) {
      var peerConnection;
      peerConnection = this._peerConnection(payload.peerId);
      return this._handleSessionDescription(peerConnection, 'answer', payload);
    };

    VegaObservatory.prototype._handleSessionDescription = function(peerConnection, descriptionType, payload) {
      var sessionDescription;
      sessionDescription = new RTCSessionDescription(payload[descriptionType]);
      peerConnection.setRemoteDescription(sessionDescription);
      return this.trigger(descriptionType, payload);
    };

    VegaObservatory.prototype._handleCandidate = function(payload) {
      var iceCandidate, peerConnection;
      peerConnection = this._peerConnection(payload.peerId);
      iceCandidate = new RTCIceCandidate(payload.candidate);
      peerConnection.addIceCandidate(iceCandidate);
      return this.trigger('candidate', payload);
    };

    VegaObservatory.prototype._handlePeerHangUp = function(payload) {
      this.trigger('peerHangUp', payload);
      return delete this.peerStore[payload.peerId];
    };

    VegaObservatory.prototype._addPeerToStore = function(peer) {
      var peerConnection;
      peerConnection = this.peerConnectionFactory.create(this, peer, this.options.peerConnectionConfig);
      peer.peerConnection = peerConnection;
      this.peerStore.add(peer);
      return peerConnection;
    };

    VegaObservatory.prototype._peerConnection = function(peerId) {
      return this.peerStore.find(peerId).peerConnection;
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

    return VegaObservatory;

  })();

  module.exports = VegaObservatory;

}).call(this);

},{"../webrtc-interop/webrtc-interop.js":9,"./private/peer-connection-factory":5,"./private/peer-store":6,"./private/session-description-creator":7,"vega-client":3}],9:[function(require,module,exports){
(function (global){
// Generated by CoffeeScript 1.7.1
(function() {
  var WebRTCInterop;

  WebRTCInterop = (function() {
    function WebRTCInterop() {}

    WebRTCInterop.infectGlobal = function() {
      var _ref, _ref1, _ref2, _ref3;
      global.RTCPeerConnection = (_ref = (_ref1 = global.RTCPeerConnection) != null ? _ref1 : global.webkitRTCPeerConnection) != null ? _ref : global.mozRTCPeerConnection;
      global.RTCSessionDescription = (_ref2 = global.RTCSessionDescription) != null ? _ref2 : global.mozRTCSessionDescription;
      return global.RTCIceCandidate = (_ref3 = global.RTCIceCandidate) != null ? _ref3 : global.mozRTCIceCandidate;
    };

    return WebRTCInterop;

  })();

  module.exports = WebRTCInterop;

}).call(this);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1]);
