<script>
  import ActionButton from "./ActionButton.svelte";
</script>

<main>
  <div class="controls">
    <ActionButton onIcon="mic.svg" offIcon="mic-off.svg" />
    <ActionButton onIcon="phone.svg" />
    <ActionButton onIcon="video.svg" offIcon="video-off.svg" />
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
