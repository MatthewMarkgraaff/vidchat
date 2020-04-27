<script>
  export let onClick;
  export let onIcon;
  export let offIcon;
  export let onState = true;

  function handleOnClick() {
    if(onClick) {
      onClick();
    }
  }
</script>

<main>
  <button class="button action-button" on:click={handleOnClick}>
    <img src={ "/call/images/icons/" + (onState ? onIcon : offIcon) }>
  </button>
</main>

<style lang="scss">
  .action-button {
    border-radius: 50%;
    padding: 8px;
  }
</style>
