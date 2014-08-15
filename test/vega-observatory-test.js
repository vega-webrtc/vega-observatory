// Generated by CoffeeScript 1.7.1
(function() {
  describe('VegaObservatory', function() {
    beforeEach(function() {
      var options;
      window.RTCSessionDescription = (function() {
        function RTCSessionDescription() {}

        return RTCSessionDescription;

      })();
      window.RTCIceCandidate = (function() {
        function RTCIceCandidate() {}

        return RTCIceCandidate;

      })();
      this.peerConnectionConfig = new Object;
      options = {
        url: 'ws://0.0.0.0:3000',
        roomId: '/abc123',
        badge: {},
        peerConnectionConfig: this.peerConnectionConfig
      };
      this.vegaObservatory = new VegaObservatory(options);
      this.peerConnectionUtil = this.vegaObservatory.peerConnectionUtil;
      return this.vegaClient = this.vegaObservatory.vegaClient;
    });
    afterEach(function() {
      return sinon.collection.restore();
    });
    describe('#call', function() {
      return it('delegates to the vega client', function() {
        var call;
        call = sinon.collection.stub(this.vegaClient, 'call');
        this.vegaObservatory.call();
        return expect(call).to.have.been.called;
      });
    });
    describe('#createOffer', function() {
      return it('creates an offer on the peer connection with success and failure callbacks', function() {
        var createOffer, errorCallback, successCallback;
        this.peerConnection = {
          createOffer: function() {}
        };
        this.peerId = 'peerId';
        this.vegaObservatory.peerStore = {
          'peerId': {
            badge: {
              name: 'Dave'
            },
            peerConnection: this.peerConnection
          }
        };
        successCallback = sinon.collection.mock();
        errorCallback = sinon.collection.mock();
        createOffer = sinon.collection.stub(this.peerConnection, 'createOffer');
        sinon.collection.stub(this.peerConnectionUtil, 'descriptionCallbacks').withArgs(this.vegaClient, this.peerId, this.peerConnection, 'offer').returns([successCallback, errorCallback]);
        this.vegaObservatory.createOffer(this.peerId);
        return expect(createOffer).to.have.been.calledWith(successCallback, errorCallback);
      });
    });
    describe('#createAnswer', function() {
      return it('creates an answer on the peer connection with success and failure callbacks', function() {
        var createAnswer, errorCallback, successCallback;
        this.peerConnection = {
          createAnswer: function() {}
        };
        this.peerId = 'peerId';
        this.vegaObservatory.peerStore = {
          'peerId': {
            badge: {
              name: 'Dave'
            },
            peerConnection: this.peerConnection
          }
        };
        successCallback = sinon.collection.mock();
        errorCallback = sinon.collection.mock();
        createAnswer = sinon.collection.stub(this.peerConnection, 'createAnswer');
        sinon.collection.stub(this.peerConnectionUtil, 'descriptionCallbacks').withArgs(this.vegaClient, this.peerId, this.peerConnection, 'answer').returns([successCallback, errorCallback]);
        this.vegaObservatory.createAnswer(this.peerId);
        return expect(createAnswer).to.have.been.calledWith(successCallback, errorCallback);
      });
    });
    return describe('vega client callbacks', function() {
      beforeEach(function() {
        this.peerConnection = {
          setRemoteDescription: function() {}
        };
        return this.createPeerConnection = sinon.collection.stub(this.peerConnectionUtil, 'createPeerConnection');
      });
      describe('on callAccepted', function() {
        beforeEach(function() {
          this.peer1 = {
            peerId: 'peerId1',
            badge: {
              name: 'Dave'
            }
          };
          this.peer2 = {
            peerId: 'peerId2',
            badge: {
              name: 'Allie'
            }
          };
          this.peers = [this.peer1, this.peer2];
          return this.peers.forEach((function(_this) {
            return function(peer) {
              return _this.createPeerConnection.withArgs(_this.vegaObservatory, peer, _this.peerConnectionConfig).returns(_this.peerConnection);
            };
          })(this));
        });
        it('saves references to all peers in the response', function() {
          this.vegaClient.trigger('callAccepted', this.peers);
          return expect(this.vegaObservatory.peerStore).to.eql({
            "peerId1": {
              badge: this.peer1.badge,
              peerConnection: this.peerConnection
            },
            "peerId2": {
              badge: this.peer2.badge,
              peerConnection: this.peerConnection
            }
          });
        });
        return it('triggers a callAccepted event on the observatory', function() {
          var object;
          object = {};
          this.vegaObservatory.on('callAccepted', function(payload) {
            return object.peers = payload;
          });
          this.vegaClient.trigger('callAccepted', this.peers);
          return expect(object.peers).to.eq(this.peers);
        });
      });
      describe('on offer', function() {
        beforeEach(function() {
          var offer, peer;
          this.badge = {
            name: 'Dave'
          };
          peer = {
            peerId: 'peerId',
            badge: this.badge
          };
          this.payload = peer;
          offer = {
            'offer key': 'offer value'
          };
          this.payload.offer = offer;
          this.createPeerConnection.withArgs(this.vegaObservatory, peer, this.peerConnectionConfig).returns(this.peerConnection);
          this.setRemoteDescription = sinon.collection.stub(this.peerConnection, 'setRemoteDescription');
          return this.rtcSessionDescription = sinon.createStubInstance(window.RTCSessionDescription);
        });
        it('saves a reference to the peer', function() {
          this.vegaClient.trigger('offer', this.payload);
          return expect(this.vegaObservatory.peerStore).to.eql({
            "peerId": {
              badge: this.badge,
              peerConnection: this.peerConnection
            }
          });
        });
        it('sets the offer on the peer connection via session description', function() {
          this.vegaClient.trigger('offer', this.payload);
          return expect(this.setRemoteDescription).to.have.been.calledWith(this.rtcSessionDescription);
        });
        return it('triggers an offer event', function() {
          var object;
          object = {};
          this.vegaObservatory.on('offer', function(payload) {
            return object.payload = payload;
          });
          this.vegaClient.trigger('offer', this.payload);
          return expect(object.payload).to.eq(this.payload);
        });
      });
      describe('on answer', function() {
        beforeEach(function() {
          this.peerId = 'peerId';
          this.peerConnection = {
            setRemoteDescription: function() {}
          };
          this.badge = {
            name: 'Dave'
          };
          this.vegaObservatory.peerStore = {
            'peerId': {
              badge: this.badge,
              peerConnection: this.peerConnection
            }
          };
          this.payload = {
            answer: {
              an: 'answer'
            },
            peerId: this.peerId
          };
          this.setRemoteDescription = sinon.collection.stub(this.peerConnection, 'setRemoteDescription');
          return this.rtcSessionDescription = sinon.createStubInstance(window.RTCSessionDescription);
        });
        it('sets the answer on the peer connection via session description', function() {
          this.vegaClient.trigger('answer', this.payload);
          return expect(this.setRemoteDescription).to.have.been.calledWith(this.rtcSessionDescription);
        });
        return it('triggers an answer event', function() {
          var object;
          object = {};
          this.vegaObservatory.on('answer', function(payload) {
            return object.payload = payload;
          });
          this.vegaClient.trigger('answer', this.payload);
          return expect(object.payload).to.eq(this.payload);
        });
      });
      describe('on candidate', function() {
        beforeEach(function() {
          this.peerConnection = {
            addIceCandidate: function() {}
          };
          this.badge = {
            name: 'Dave'
          };
          this.peerId = 'peerId';
          this.vegaObservatory.peerStore = {
            'peerId': {
              badge: this.badge,
              peerConnection: this.peerConnection
            }
          };
          this.payload = {
            candidate: {
              an: 'candidate'
            },
            peerId: this.peerId
          };
          this.addIceCandidate = sinon.collection.stub(this.peerConnection, 'addIceCandidate');
          return this.rtcIceCandidate = sinon.createStubInstance(window.RTCIceCandidate);
        });
        it('adds the ice candidate to the proper peer connection', function() {
          this.vegaClient.trigger('candidate', this.payload);
          return expect(this.addIceCandidate).to.have.been.calledWith(this.rtcIceCandidate);
        });
        return it('triggers a candidate event with the payload', function() {
          var object;
          object = {};
          this.vegaObservatory.on('candidate', function(payload) {
            return object.payload = payload;
          });
          this.vegaClient.trigger('candidate', this.payload);
          return expect(object.payload).to.eq(this.payload);
        });
      });
      return describe('on peerHangUp', function() {
        beforeEach(function() {
          this.badge = {
            name: 'Dave'
          };
          this.peerId = 'peerId';
          this.vegaObservatory.peerStore = {
            'peerId': {
              badge: this.badge,
              peerConnection: this.peerConnection
            }
          };
          return this.payload = {
            peerId: this.peerId
          };
        });
        it('triggers a peerHangUp event', function() {
          var object;
          object = {};
          this.vegaObservatory.on('peerHangUp', function(payload) {
            return object.payload = payload;
          });
          this.vegaClient.trigger('peerHangUp', this.payload);
          return expect(object.payload).to.eq(this.payload);
        });
        return it('removes the peer from the peer store', function() {
          this.vegaClient.trigger('peerHangUp', this.payload);
          return expect(this.vegaObservatory.peerStore).to.eql({});
        });
      });
    });
  });

}).call(this);
