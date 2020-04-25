import { sendMessage, socketActions } from './newCallController';

const configuration = {
  iceServers: [{
    urls: 'stun:stun.l.google.com:19302'
  }]
};

export default function startWebRTC(isOfferer, { localStream }) {
  let peerConnection = new RTCPeerConnection(configuration);

  peerConnection.onicecandidate = (event) => {
    const { candidate } = event;
    if(candidate) {
      sendMessage({ candidate });
    }
  }

  if(isOfferer) {
    peerConnection.onnegotiationneeded = async () => {
      peerConnection.createOffer().then(localDescriptionCreated).catch(onError)
    }
  }

  peerConnection.onaddstream = ({ stream }) => {
    const remoteVideo = document.getElementById("remoteVideo");
    remoteVideo.srcObject = stream;
  }

  peerConnection.addStream(localStream);

  function localDescCreated(desc) {
    peerConnection.setLocalDescription(
      desc,
      () => sendMessage({'sdp': peerConnection.localDescription}),
      onError
    );
  }
}



function onError(error) {
  console.error(error);
};


