// Generated by CoffeeScript 1.7.1
(function() {
  var SessionDescriptionCreator,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

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
      this.sendAnswer = __bind(this.sendAnswer, this);
      this.sendOffer = __bind(this.sendOffer, this);
    }

    SessionDescriptionCreator.prototype.forOffer = function() {
      return this.peerConnection.createOffer(this.successCallback(this.sendOffer), this.failureCallback);
    };

    SessionDescriptionCreator.prototype.forAnswer = function() {
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
