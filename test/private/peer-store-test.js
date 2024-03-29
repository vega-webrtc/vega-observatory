// Generated by CoffeeScript 1.7.1
(function() {
  var PeerStore;

  require('../test-helper');

  PeerStore = require('../../private/peer-store');

  describe('PeerStore', function() {
    beforeEach(function() {
      this.URL = {
        createObjectURL: function() {}
      };
      return this.peerStore = new PeerStore({
        URL: this.URL
      });
    });
    afterEach(function() {
      delete this.thePeer;
      return this.peerStore.peers = [];
    });
    describe('#add', function() {
      beforeEach(function() {
        return this.peer = new Object;
      });
      it('adds a peer to the stores', function() {
        this.peerStore.add(this.peer);
        return expect(this.peerStore.peers).to.eql([this.peer]);
      });
      return it('triggers an add event', function() {
        this.peerStore.on('add', (function(_this) {
          return function(peer) {
            return _this.thePeer = peer;
          };
        })(this));
        this.peerStore.add(this.peer);
        return expect(this.thePeer).to.eq(this.peer);
      });
    });
    describe('#remove', function() {
      beforeEach(function() {
        this.peerId = 'peerId';
        this.peer = {
          peerId: this.peerId
        };
        return this.peerStore.peers = [this.peer];
      });
      it('removes the peer with the peerId from the peers', function() {
        this.peerStore.remove(this.peerId);
        return expect(this.peerStore.peers).to.be.empty;
      });
      return it('triggers a remove event', function() {
        this.peerStore.on('remove', (function(_this) {
          return function(peer) {
            return _this.thePeer = peer;
          };
        })(this));
        this.peerStore.remove(this.peerId);
        return expect(this.thePeer).to.eq(this.peer);
      });
    });
    describe('#addStream', function() {
      beforeEach(function() {
        this.peerId = 'peerId';
        this.peer = {
          peerId: this.peerId
        };
        this.peerStore.peers = [this.peer];
        this.stream = new Object;
        this.streamUrl = 'abc123';
        return sinon.collection.stub(this.URL, 'createObjectURL').withArgs(this.stream).returns(this.streamUrl);
      });
      it('attaches the stream to the peer of the id', function() {
        this.peerStore.addStream(this.peerId, this.stream);
        return expect(this.peer.stream).to.eq(this.stream);
      });
      it('adds a streamUrl to peer', function() {
        this.peerStore.addStream(this.peerId, this.stream);
        return expect(this.peer.streamUrl).to.eq(this.streamUrl);
      });
      return it('triggers a streamAdded event', function() {
        var peer;
        this.peerStore.on('streamAdded', (function(_this) {
          return function(peer) {
            return _this.thePeer = peer;
          };
        })(this));
        peer = new Object(this.peer);
        peer.stream = this.stream;
        this.peerStore.addStream(this.peerId, this.stream);
        return expect(this.thePeer).to.eql(peer);
      });
    });
    return describe('queries', function() {
      beforeEach(function() {
        this.peerWithStreamId = '1';
        this.peerWithoutStreamId = '2';
        this.peerWithStream = {
          peerId: this.peerWithStreamId,
          stream: new Object
        };
        this.peerWithoutStream = {
          peerId: this.peerWithoutStreamId
        };
        return this.peerStore.peers = [this.peerWithStream, this.peerWithoutStream];
      });
      describe('#peersWithStreams', function() {
        return it('returns peers that have streams', function() {
          return expect(this.peerStore.peersWithStreams()).to.eql([this.peerWithStream]);
        });
      });
      describe('#peersWithoutStreams', function() {
        return it('returns peers that do not have streams', function() {
          return expect(this.peerStore.peersWithoutStreams()).to.eql([this.peerWithoutStream]);
        });
      });
      return describe('#find', function() {
        return it('returns the peer of the peer id', function() {
          expect(this.peerStore.find(this.peerWithStreamId)).to.eq(this.peerWithStream);
          return expect(this.peerStore.find(this.peerWithoutStreamId)).to.eq(this.peerWithoutStream);
        });
      });
    });
  });

}).call(this);
