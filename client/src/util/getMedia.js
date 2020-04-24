async function getMedia(constraints = { audio: true, video: true }) {
  try {
    const mediaDevices = await navigator.mediaDevices.enumerateDevices();

    const cameraDetected = mediaDevices.find(device => device.kind === "videoinput");
    const micDetected = mediaDevices.find(device => device.kind === "audioinput");

    const mediaConstraints = {
      video: cameraDetected && constraints.video,
      audio: micDetected && constraints.audio
    };

    return navigator.mediaDevices.getUserMedia(mediaConstraints);
  } catch(err) {
    if (err.name !== 'NotFoundError') {
      throw err;
    }
  }
};

export default getMedia;
