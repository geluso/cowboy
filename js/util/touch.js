$(document).on('touchstart', function(e) {
    if (e.target.nodeName !== 'INPUT') {
        e.preventDefault();
    }
});

document.addEventListener('DOMContentLoaded', function() {
  var mc = new Hammer.Manager(document);
  mc.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
  mc.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));

  mc.on("panstart", function(ev) {
    log("pan start");
    mousedown(hammerEventToMouseEvent(ev));
  });

  mc.on("panmove", function(ev) {
    log("panning");
    mousemove(hammerEventToMouseEvent(ev));
  });

  mc.on("tap", function(ev) {
    log("tap");
    var ee = hammerEventToMouseEvent(ev);
    mousedown(ee);
    mouseup(ee);
    click(ee);
  });

  mc.on("doubletap", function(ev) {
    log("doubletap");
    var ee = hammerEventToMouseEvent(ev);
    mousedown(ee);
    mouseup(ee);
    click(ee);
  });

  function hammerEventToMouseEvent(ev) {
    return {
      offsetX: ev.center.x,
      offsetY: ev.center.y
    }
  }
});
