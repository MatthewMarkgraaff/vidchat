'use strict';

import io from 'socket.io-client';

const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};

let socket;
let peerConnection;

export async function newCallController(room) {
  socket = io.connect();

  listenForSignals();

  console.log("creating or joining room: " + room);
  socket.emit(socketActions.createOrJoin, room);

  socket.on(socketActions.created, (room)=>{
    console.log("room created");
  });

  socket.on(socketActions.join, (room)=>{
    console.log("attempting to join");
  });

  socket.on(socketActions.joined, (room)=>{
    console.log("someone joined the room");
  });
}

function listenForSignals() {
  socket.on(socketActions.message, (message, client) => {
    if (message.sdp) {
      peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp), () => {
        if (peerConnection.remoteDescription.type === socketActions.offer) {
          peerConnection.createAnswer().then(localDescCreated).catch(onError);
          peerConnection.setRemoteDescription(new RTCSessionDescription(message));
        }
      }, onError);
    } else if (message.candidate) {
      console.log("adding candidate " + message.candidate);
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: message.candidate.sdpMLineIndex,
        candidate: message.candidate
      });
      peerConnection.addIceCandidate(candidate);
    }
  });
}

export function startWebRTC(isOfferer, { localStream }) {
  peerConnection = new RTCPeerConnection(configuration);

  peerConnection.onicecandidate = (event) => {
    const { candidate } = event;
    if(candidate) {
      sendMessage({ candidate });
    }
  }

  if(isOfferer) {
    peerConnection.onnegotiationneeded = async () => {
      peerConnection.createOffer().then(localDescCreated).catch(onError)
    }
  }

  peerConnection.onaddstream = ({ stream }) => {
    const remoteVideo = document.getElementById("remoteVideo");
    remoteVideo.srcObject = stream;
  }

  peerConnection.addStream(localStream);
}

function onError(error) {
  console.error(error);
};

function localDescCreated(desc) {
  peerConnection.setLocalDescription(
    desc,
    () => sendMessage({'sdp': peerConnection.localDescription}),
    onError
  );
}

export function sendMessage(message) {
  console.log('Client sending message: ', message);
  socket.emit(
    socketActions.message,
    message,
  );
}

export const socketActions = {
  createOrJoin: "create or join",
  created: "created",
  join: "join",
  joined: "joined",
  message: "message",
  data: "data",
};
