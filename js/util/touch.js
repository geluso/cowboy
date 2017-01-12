document.addEventListener('DOMContentLoaded', function() {
  var stack = document.getElementById("stack");
  stack.addEventListener("touchstart", function(ev) {
    console.log(ev.target);
    var xy = firstTouchToMouseEvent(ev);
    mousedown(xy);
  })
  stack.addEventListener("touchmove", function(ev) {
    var xy = firstTouchToMouseEvent(ev);
    mousemove(xy);
  })
  stack.addEventListener("touchend", function(ev) {
    var xy = firstTouchToMouseEvent(ev);
    mouseup(xy);
  })

  function firstTouchToMouseEvent(ev) {
    if (ev.touches.length === 0) {
      return fakeMouseEvent(MOUSE_X, MOUSE_Y);
    }
    var touch = ev.touches[0];
    return fakeMouseEvent(touch.clientX, touch.clientY);
  }

  function fakeMouseEvent(x, y) {
    return {
      offsetX: x,
      offsetY: y
    }
  }
});
