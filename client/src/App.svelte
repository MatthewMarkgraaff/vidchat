<script>
  import { onMount } from 'svelte';
  import "../assets/main.scss";
  import getMedia from './util/getMedia';
  import adapter from 'webrtc-adapter';
  import { newCallController } from './util/newCallController';
  import callerState from './store/callerState';

  import Controls from './components/controls/Controls.svelte'
  import { fetchTurnServerConfig } from './util/apiClient';

  onMount(async ()=>{
    if (!location.hash) {
      location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    }

    const roomHash = location.hash.substring(1);

    callerState.setAudio(true);
    callerState.setVideo(true);

    const turnServerConfig = await fetchTurnServerConfig();
    newCallController(roomHash, { turnServerConfig });
  });
</script>

<main id="video-container">
  <video class="full-screen-video" id="localVideo" autoplay playsinline></video>
  <video class="secondary-video" id="remoteVideo" autoplay playsinline></video>
  <Controls />
</main>

<style>
  main {
    max-width: 240px;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  .full-screen-video {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    height: 100%;
    width: 100%;
    z-index: 1;
  }

  .secondary-video {
    position: fixed;
    top: 40px;
    right: 40px;
    width: 15%;
    height: 15%;
    z-index: 10;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
