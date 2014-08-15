// Generated by CoffeeScript 1.7.1
(function() {
  var PeerConnectionUtil;

  PeerConnectionUtil = (function() {
    function PeerConnectionUtil() {}

    PeerConnectionUtil.createPeerConnection = function(observatory, peer, config, pcConstructor) {
      var peerCandidate, peerId, vegaClient;
      if (pcConstructor == null) {
        pcConstructor = RTCPeerConnection;
      }
      vegaClient = observatory.vegaClient;
      peerCandidate = new pcConstructor(config);
      peerId = peer.peerId;
      peerCandidate.onicecandidate = function(event) {
        var candidate;
        if (candidate = event.candidate) {
          return vegaClient.candidate(candidate, peerId);
        }
      };
      peerCandidate.onaddstream = function(event) {
        return observatory.trigger('remoteStreamAdded', peer, event.stream);
      };
      return peerCandidate;
    };

    PeerConnectionUtil.descriptionCallbacks = function() {};

    return PeerConnectionUtil;

  })();

  module.exports = PeerConnectionUtil;

}).call(this);
