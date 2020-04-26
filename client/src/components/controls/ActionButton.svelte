<script>
  export let onIcon;
  export let offIcon;
  export let onState = true;

  function handleOnClick() {
    if(onIcon && offIcon)
      onState = !onState;
  }
</script>

<main>
  <button class="button action-button" on:click={handleOnClick}>
    <img src={ "/images/icons/" + (onState ? onIcon : offIcon) }>
  </button>
</main>

<style lang="scss">
  .action-button {
    border-radius: 50%;
    padding: 8px;
  }
</style>
