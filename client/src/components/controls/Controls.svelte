<script>
  import ActionButton from "./ActionButton.svelte";
  import callerState from "../../store/callerState";

  let audio = true;
  let video = true;

  callerState.audio.subscribe(value => audio = value);
  callerState.video.subscribe(value => video = value);
</script>

<main>
  <div class="controls">
    <ActionButton
      onClick={()=>callerState.setAudio(!audio)}
      onState={audio}
      onIcon="mic.svg"
      offIcon="mic-off.svg" />
    <ActionButton
      onIcon="phone.svg" />
    <ActionButton
      onClick={()=>callerState.setVideo(!video)}
      onState={video}
      onIcon="video.svg"
      offIcon="video-off.svg" />
  </div>
</main>

<style lang="scss">
  .controls {
    position: fixed;
    bottom: 5%;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
  }
</style>
