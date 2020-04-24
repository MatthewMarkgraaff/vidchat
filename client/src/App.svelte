<script>
  import { onMount } from 'svelte';
  import { establishConnection } from './util/callController';
  import getMedia from './util/getMedia';
  import adapter from 'webrtc-adapter';

  import Participant from './call/participant/Participant.svelte';

  let stream;

  const participants = [
    { id: 1, name: "matthew" }
  ];

  onMount(async ()=>{
    establishConnection(async ()=>{
      stream = await getMedia();
      const video = document.getElementById("localVideo")
      video.srcObject = stream;
    });
  });

	export let name;
</script>

<main>
  <video id="localVideo" autoplay playsinline></video>
  <video id="remoteVideo" autoplay playsinline></video>
  <canvas></canvas>
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
