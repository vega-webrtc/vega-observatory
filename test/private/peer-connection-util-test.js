// Generated by CoffeeScript 1.7.1
(function() {
  var chai, expect, sinon, sinonChai;

  chai = require('chai');

  sinon = require('sinon');

  sinonChai = require('sinon-chai');

  expect = chai.expect;

  chai.use(sinonChai);

  describe('PeerConnectionUtil', function() {
    beforeEach(function() {
      return this.peerConnectionUtil = require('../../private/peer-connection-util.js');
    });
    afterEach(function() {
      return sinon.collection.restore();
    });
    return describe('.createPeerConnection', function() {
      beforeEach(function() {
        var peerConnectionConfig;
        this.vegaClient = {
          candidate: function() {}
        };
        this.vegaObservatory = {
          vegaClient: this.vegaClient,
          trigger: function() {}
        };
        this.peerId = 'peerId';
        this.peer = {
          peerId: this.peerId,
          badge: {
            name: 'Dave'
          }
        };
        peerConnectionConfig = {};
        this.pcConstructor = function(arg) {
          if (arg !== peerConnectionConfig) {
            throw new Error('must include peer connection config!');
          }
        };
        return this.peerConnection = this.peerConnectionUtil.createPeerConnection(this.vegaObservatory, this.peer, peerConnectionConfig, this.pcConstructor);
      });
      it('returns an RTCPeerConnection', function() {
        return expect(this.peerConnection).to.be.instanceOf(this.pcConstructor);
      });
      it('sends a candidate through the vega client on ice candidate', function() {
        var candidate, event;
        candidate = sinon.collection.stub(this.vegaClient, 'candidate');
        event = {
          candidate: {
            cool: 'stuff'
          }
        };
        this.peerConnection.onicecandidate(event);
        return expect(candidate).to.have.been.calledWith(event.candidate, this.peerId);
      });
      return it('triggers a remoteStreamAdded event on the observatory when a stream is added', function() {
        var event, trigger;
        trigger = sinon.collection.stub(this.vegaObservatory, 'trigger');
        event = {
          stream: 'an audio/video stream'
        };
        this.peerConnection.onaddstream(event);
        return expect(trigger).to.have.been.calledWith('remoteStreamAdded', this.peer, event.stream);
      });
    });
  });

}).call(this);
