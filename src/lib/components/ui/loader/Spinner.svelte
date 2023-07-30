<script lang="ts">
  export let width: number = 18
</script>

<div class="spinner" style="width: {width}px; height: {width}px;">
  <div class="bar1" />
  <div class="bar2" />
  <div class="bar3" />
  <div class="bar4" />
  <div class="bar5" />
  <div class="bar6" />
  <div class="bar7" />
  <div class="bar8" />
  <div class="bar9" />
  <div class="bar10" />
  <div class="bar11" />
  <div class="bar12" />
</div>

<style lang="postcss">
  div.spinner {
    position: relative;
    display: inline-block;
    border-radius: 10px;
  }

  div.spinner div {
    width: 7.5%;
    height: 22%;
    position: absolute;
    left: 49%;
    top: 43%;
    opacity: 0;
    border-radius: 50px;
    animation: fade 1s linear infinite;
    @apply bg-black dark:bg-white;
  }

  @keyframes fade {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.25;
    }
  }

  div.spinner div.bar1 {
    transform: rotate(0deg) translate(0, -130%);
    animation-delay: 0s;
  }

  div.spinner div.bar2 {
    transform: rotate(30deg) translate(0, -130%);
    animation-delay: -0.9167s;
  }

  div.spinner div.bar3 {
    transform: rotate(60deg) translate(0, -130%);
    animation-delay: -0.833s;
  }
  div.spinner div.bar4 {
    transform: rotate(90deg) translate(0, -130%);
    animation-delay: -0.7497s;
  }
  div.spinner div.bar5 {
    transform: rotate(120deg) translate(0, -130%);
    animation-delay: -0.667s;
  }
  div.spinner div.bar6 {
    transform: rotate(150deg) translate(0, -130%);
    animation-delay: -0.5837s;
  }
  div.spinner div.bar7 {
    transform: rotate(180deg) translate(0, -130%);
    animation-delay: -0.5s;
  }
  div.spinner div.bar8 {
    transform: rotate(210deg) translate(0, -130%);
    animation-delay: -0.4167s;
  }
  div.spinner div.bar9 {
    transform: rotate(240deg) translate(0, -130%);
    animation-delay: -0.333s;
  }
  div.spinner div.bar10 {
    transform: rotate(270deg) translate(0, -130%);
    animation-delay: -0.2497s;
  }
  div.spinner div.bar11 {
    transform: rotate(300deg) translate(0, -130%);
    animation-delay: -0.167s;
  }
  div.spinner div.bar12 {
    transform: rotate(330deg) translate(0, -130%);
    animation-delay: -0.0833s;
  }
</style>
