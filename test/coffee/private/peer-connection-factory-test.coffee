require('../test-helper')

describe 'PeerConnectionFactory', ->
  beforeEach ->
    @peerConnectionFactory = require('../../private/peer-connection-factory.js')

  afterEach ->
    sinon.collection.restore()

  describe '.createPeerConnection', ->
    beforeEach ->
      @vegaObservatory =
        trigger: ->
        sendCandidate: ->
      @peerId = 'peerId'
      @peer =
        peerId: @peerId
        badge: { name: 'Dave' }
      peerConnectionConfig = {}
      @pcConstructor = (arg) ->
        unless arg is peerConnectionConfig
          throw new Error 'must include peer connection config!'

      @peerConnection = @peerConnectionFactory.create(@vegaObservatory, @peer, peerConnectionConfig, @pcConstructor)

    it 'returns an RTCPeerConnection', ->
      expect(@peerConnection).to.be.instanceOf @pcConstructor

    it 'sends a candidate through the vega client on ice candidate', ->
      sendCandidate = sinon.collection.stub @vegaObservatory, 'sendCandidate'
      event =
        candidate: { cool: 'stuff' }

      @peerConnection.onicecandidate(event)

      expect(sendCandidate).to.have.been.calledWith event.candidate, @peerId

    it 'triggers a remoteStreamAdded event on the observatory when a stream is added', ->
      trigger = sinon.collection.stub @vegaObservatory, 'trigger'
      event   = { stream: 'an audio/video stream' }

      @peerConnection.onaddstream(event)

      expect(trigger).to.have.been.calledWith 'remoteStreamAdded',
        @peer, event.stream
