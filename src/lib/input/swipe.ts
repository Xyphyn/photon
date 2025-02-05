enum SwipeDirection {
  Up = 'up',
  Down = 'down',
  Left = 'left',
  Right = 'right',
  None = 'none',
}

export function swipeGesture(
  node: HTMLElement,
  swipe: (dir: SwipeDirection) => any,
) {
  let touchstartX = 0
  let touchstartY = 0
  let touchendX = 0
  let touchendY = 0

  node?.addEventListener(
    'touchstart',
    function (event) {
      // @ts-ignore
      touchstartX = event?.screenX
      // @ts-ignore
      touchstartY = event?.screenY
    },
    false,
  )

  node?.addEventListener(
    'mousedown',
    function (event) {
      // @ts-ignore
      touchstartX = event?.screenX
      // @ts-ignore
      touchstartY = event?.screenY
    },
    false,
  )

  node?.addEventListener(
    'mouseup',
    function (event) {
      // @ts-ignore
      touchendX = event.screenX
      // @ts-ignore
      touchendY = event.screenY
      return swipe(swipeDir(touchstartX, touchstartY, touchendX, touchendY))
    },
    false,
  )

  node?.addEventListener(
    'touchend',
    function (event) {
      // @ts-ignore
      touchendX = event.screenX
      // @ts-ignore
      touchendY = event.screenY
      return swipe(swipeDir(touchstartX, touchstartY, touchendX, touchendY))
    },
    false,
  )
}

function swipeDir(
  touchStartX: number,
  touchStartY: number,
  touchEndX: number,
  touchEndY: number,
): SwipeDirection {
  const deltaX = touchEndX - touchStartX
  const deltaY = touchEndY - touchStartY

  // Define a threshold for the minimum swipe distance
  const minSwipeDistance = 10 // Adjust this value as needed

  // Check the absolute difference between deltaX and deltaY
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    // Horizontal swipe
    if (Math.abs(deltaX) >= minSwipeDistance) {
      return deltaX > 0 ? SwipeDirection.Right : SwipeDirection.Left
    }
  } else {
    // Vertical swipe
    if (Math.abs(deltaY) >= minSwipeDistance) {
      return deltaY > 0 ? SwipeDirection.Down : SwipeDirection.Up
    }
  }

  return SwipeDirection.None
}
