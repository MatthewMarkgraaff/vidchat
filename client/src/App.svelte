<script>
  import { onMount } from 'svelte';
  import "../assets/main.scss";
  import getMedia from './util/getMedia';
  import adapter from 'webrtc-adapter';
  import { newCallController, startWebRTC } from './util/newCallController';

  import Controls from './components/controls/Controls.svelte'

  const participants = [
    { id: 1, name: "matthew" }
  ];

  onMount(async ()=>{
    if (!location.hash) {
      location.hash = Math.floor(Math.random() * 0xFFFFFF).toString(16);
    }

    const roomHash = location.hash.substring(1);
    //newCallController(roomHash);
  });

  export let name;
</script>

<main id="video-container">
  <video id="localVideo" autoplay playsinline></video>
  <video id="remoteVideo" autoplay playsinline></video>
  <Controls />
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
