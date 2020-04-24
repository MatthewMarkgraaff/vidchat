import getMedia from './getMedia';
import io from 'socket.io-client';

let localPeerConnection;
let remotePeerConnection;

let localStream;
let remoteStream;

const offerOptions = {
  offerToReceiveVideo: 1,
};

export function manageRoomConnection() {
  var isInitiator;
  var socket = io.connect("localhost:8080");

  const room = prompt("Enter room name:");

  socket.on('ipaddr', function(ipaddr) {
    console.log('Server IP address is: ' + ipaddr);
    // updateRoomURL(ipaddr);
  });

  socket.on('created', function(room, clientId) {
    console.log('Created room', room, '- my client ID is', clientId);
    isInitiator = true;
    grabWebCamVideo();
  });

  socket.on('joined', function(room, clientId) {
    console.log('This peer has joined room', room, 'with client ID', clientId);
    isInitiator = false;
    createPeerConnection(isInitiator, configuration);
    grabWebCamVideo();
  });

  socket.on('full', function(room) {
    alert('Room ' + room + ' is full. We will create a new room for you.');
    window.location.hash = '';
    window.location.reload();
  });

  socket.on('ready', function() {
    console.log('Socket is ready');
    createPeerConnection(isInitiator, configuration);
  });

  socket.on('log', function(array) {
    console.log.apply(console, array);
  });

  socket.on('message', function(message) {
    console.log('Client received message:', message);
    signalingMessageCallback(message);
  });

  // Joining a room.
  socket.emit('create or join', room);

  if (location.hostname.match(/localhost|127\.0\.0/)) {
    socket.emit('ipaddr');
  }
}

async function callController() {
  const mediaDevices = await(getMedia());
  return mediaDevices
}

async function establishConnection(localMediaStream) {
  localStream = localMediaStream;

  localPeerConnection = new RTCPeerConnection(null);
  localPeerConnection.addEventListener('icecandidate', handleConnection);
  localPeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange
  );

  remotePeerConnection = new RTCPeerConnection(null);
  remotePeerConnection.addEventListener('icecandidate', handleConnection);
  remotePeerConnection.addEventListener(
    'iceconnectionstatechange', handleConnectionChange);
  remotePeerConnection.addEventListener('addstream', gotRemoteMediaStream);

  localPeerConnection.addStream(localStream);
  localPeerConnection.createOffer(offerOptions)
    .then(createdOffer)
    .catch((err)=>console.log(err));
}

function handleConnection(event) {
  const peerConnection = event.target;
  const iceCandidate = event.candidate;

  if (iceCandidate) {
    const newIceCandidate = new RTCIceCandidate(iceCandidate);
    const otherPeer = getOtherPeer(peerConnection);

    otherPeer.addIceCandidate(newIceCandidate)
      .then(() => {
        console.log("success: " + peerConnection);
      }).catch((error) => {
        console.error("failed: " + peerConnection + error.toString());
      });
  }
}

function getOtherPeer(peerConnection) {
  return (peerConnection === localPeerConnection) ?
    remotePeerConnection : localPeerConnection;
}

function getPeerName(peerConnection) {
  return (peerConnection === localPeerConnection) ?
    'localPeerConnection' : 'remotePeerConnection';
}

function handleConnectionChange(event) {
  const peerConnection = event.target;
}

function createdOffer(description) {
  localPeerConnection.setLocalDescription(description)
    .then(() => {
      const peerName = getPeerName(localPeerConnection);
      console.log("local description success: " + peerName)
    }).catch((err)=>console.log(err));

  remotePeerConnection.setRemoteDescription(description)
    .then(() => {
      setRemoteDescriptionSuccess(remotePeerConnection);
      const peerName = getPeerName(remotePeerConnection);
      console.log("remote description success: " + peerName)
    }).catch((err)=>console.log(err));

  remotePeerConnection.createAnswer()
    .then(createdAnswer)
    .catch((err)=>console.log(err));
}

function createdAnswer(description) {
  console.log(`Answer from remotePeerConnection:\n${description.sdp}.`);
  console.log('remotePeerConnection setLocalDescription start.');

  remotePeerConnection.setLocalDescription(description)
    .then(() => {
      console.log(remotePeerConnection);
    }).catch(err => console.log(err));

  console.log('localPeerConnection setRemoteDescription start.');
  localPeerConnection.setRemoteDescription(description)
    .then(() => {
      console.log(localPeerConnection);
    }).catch((err)=>console.log(err));
}

function gotRemoteMediaStream(event) {
  const mediaStream = event.stream;
  const remoteVideo = document.getElementById("remoteVideo");
  remoteVideo.srcObject = mediaStream;
  remoteStream = mediaStream;
}

export {
  callController,
  establishConnection,
};
