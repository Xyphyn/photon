<div class="loading">
  <div class="dot dot1" />
  <div class="dot dot2" />
  <div class="dot dot3" />
</div>

<style>
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background-color: #555;
    opacity: 0.3;
    margin: 0px 1px;
    animation: blink 750ms infinite;
  }

  .dot1 {
    animation-delay: 0s;
  }

  .dot2 {
    animation-delay: 0.2s;
  }

  .dot3 {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0% {
      opacity: 0.3;
    }
    20% {
      opacity: 1;
    }
    100% {
      opacity: 0.3;
    }
  }
</style>
