// Generated by CoffeeScript 1.7.1
(function() {
  var PeerConnectionUtil, VegaClient, VegaObservatory;

  VegaClient = require('vega-client');

  PeerConnectionUtil = require('./private/peer-connection-util');

  VegaObservatory = (function() {
    function VegaObservatory(options) {
      this.options = options;
      this.vegaClient = new VegaClient(this.options.url, this.options.roomId, this.options.badge);
      this.peerConnectionUtil = PeerConnectionUtil;
      this.callbacks = {};
      this.peerStore = {};
      this._setClientCallbacks();
    }

    VegaObservatory.prototype.call = function() {
      return this.vegaClient.call();
    };

    VegaObservatory.prototype.createOffer = function(peerId) {
      var errorCallback, peerConnection, successCallback, _ref;
      peerConnection = this.peerStore[peerId].peerConnection;
      _ref = this.peerConnectionUtil.descriptionCallbacks(this.vegaClient, peerId, peerConnection, 'offer'), successCallback = _ref[0], errorCallback = _ref[1];
      return peerConnection.createOffer(successCallback, errorCallback);
    };

    VegaObservatory.prototype.createAnswer = function(peerId) {
      var errorCallback, peerConnection, successCallback, _ref;
      peerConnection = this.peerStore[peerId].peerConnection;
      _ref = this.peerConnectionUtil.descriptionCallbacks(this.vegaClient, peerId, peerConnection, 'answer'), successCallback = _ref[0], errorCallback = _ref[1];
      return peerConnection.createAnswer(successCallback, errorCallback);
    };

    VegaObservatory.prototype._setClientCallbacks = function() {
      this.vegaClient.on('callAccepted', (function(_this) {
        return function(payload) {
          return _this._handleCallAccepted(payload);
        };
      })(this));
      this.vegaClient.on('offer', (function(_this) {
        return function(payload) {
          var peer, peerConnection;
          peer = new Object(payload);
          peer.offer = null;
          peerConnection = _this._addPeerToStore(peer);
          return _this._handleSessionDescription(peerConnection, 'offer', payload);
        };
      })(this));
      this.vegaClient.on('answer', (function(_this) {
        return function(payload) {
          var peerConnection;
          peerConnection = _this.peerStore[payload.peerId].peerConnection;
          return _this._handleSessionDescription(peerConnection, 'answer', payload);
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

    VegaObservatory.prototype._handleSessionDescription = function(peerConnection, descriptionType, payload) {
      var sessionDescription;
      sessionDescription = new RTCSessionDescription(payload[descriptionType]);
      peerConnection.setRemoteDescription(sessionDescription);
      return this.trigger(descriptionType, payload);
    };

    VegaObservatory.prototype._handleCandidate = function(payload) {
      var iceCandidate, peerConnection;
      peerConnection = this.peerStore[payload.peerId].peerConnection;
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
      peerConnection = this.peerConnectionUtil.createPeerConnection(this, peer, this.options.peerConnectionConfig);
      this.peerStore[peer.peerId] = {
        badge: peer.badge,
        peerConnection: peerConnection
      };
      return peerConnection;
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
