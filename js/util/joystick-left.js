  document.addEventListener("DOMContentLoaded", function() {
  var LAST_WHISTLE = undefined;
  var SIZE = 100;

  var zone = document.getElementById('joystick-left');

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

    // reset keyboard interactions so they're recomputed each time.
    KEYBOARD[UP] = false;
    KEYBOARD[DOWN] = false;
    KEYBOARD[LEFT] = false;
    KEYBOARD[RIGHT] = false;

    var angle = data.angle.degree;
    if (angle > 330 || angle < 30) {
      KEYBOARD[RIGHT] = true;
    } else if (angle < 60) {
      KEYBOARD[UP] = true;
      KEYBOARD[RIGHT] = true;
    } else if (angle < 120) {
      KEYBOARD[UP] = true;
    } else if (angle < 150) {
      KEYBOARD[UP] = true;
      KEYBOARD[LEFT] = true;
    } else if (angle < 210) {
      KEYBOARD[LEFT] = true;
    } else if (angle < 240) {
      KEYBOARD[LEFT] = true;
      KEYBOARD[DOWN] = true;
    } else if (angle < 300) {
      KEYBOARD[DOWN] = true;
    } else {
      KEYBOARD[RIGHT] = true;
      KEYBOARD[DOWN] = true;
    }
  });

  leftJoystick.on('end', function(ev, data) {
    KEYBOARD[UP] = false;
    KEYBOARD[DOWN] = false;
    KEYBOARD[LEFT] = false;
    KEYBOARD[RIGHT] = false;
  });
});
