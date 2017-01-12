document.addEventListener("DOMContentLoaded", function() {
  var LAST_WHISTLE = undefined;
  var SIZE = 100;

  var zone = document.getElementById('left-joystick');

  var leftJoystick = nipplejs.create({
    zone: zone,
    mode: 'static',
    position: {top: '50%', left: '50%'},
    color: 'black',
    size: SIZE
  });

  leftJoystick.on("start", function() {
    var dt = Date.now() - LAST_WHISTLE;
    if (dt < 300) {
      // whistle the horse over if he's not being ridden.
      if (HORSE.unbridled) {
        set_waypoint(HORSE, COWBOY.x, COWBOY.y);
      } else {
        // otherwise, get off the horse.
        HORSE.unbridle();
      }
    }

    LAST_WHISTLE = Date.now();
  });


  leftJoystick.on('move', function(ev, data) {
    if (!data.direction) {
      return;
    }

    var xDirection = data.direction.x;
    var yDirection = data.direction.y;

    KEYBOARD[UP] = yDirection === "up";
    KEYBOARD[DOWN] = yDirection === "down";
    KEYBOARD[LEFT] = xDirection === "left";
    KEYBOARD[RIGHT] = xDirection === "right";
  });

  leftJoystick.on('end', function(ev, data) {
    KEYBOARD[UP] = false;
    KEYBOARD[DOWN] = false;
    KEYBOARD[LEFT] = false;
    KEYBOARD[RIGHT] = false;
  });
});
