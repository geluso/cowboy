$(document).keydown(function (e) {
  press(e, COWBOY);
});
$(document).keyup(function (e) {
  release(e, COWBOY);
});

var KEYBOARD = {},
    UP = 87,
    DOWN = 83,
    LEFT = 65,
    RIGHT = 68,
    ENTER = 13,
    B = 66,
    E = 69,
    F = 70,
    I = 73,
    O = 79,
    P = 80,
    Q = 81,
    R = 82,
    S = 83,
    X = 88,
    SPACE = 32,
    SHIFT = 16;

function release(e) {
  KEYBOARD[e.which] = false;
  KEYBOARD[e.keyCode] = false;
}

function press(e, actor) {
  KEYBOARD[e.which] = true;
  KEYBOARD[e.keyCode] = true;

  if (KEYBOARD[X]) {
    DRAW_HELP_TEXT = !DRAW_HELP_TEXT;
  }

  // Toggle bounding box draw
  if (KEYBOARD[B]) {
    DRAW_BOUNDING_BOXES = !DRAW_BOUNDING_BOXES;
  }

  // toggle only drawing static objects
  if (KEYBOARD[S]) {
    ONLY_STATIC_BOUNDING_BOXES = !ONLY_STATIC_BOUNDING_BOXES;
  }

  if (KEYBOARD[R]) {
    DRAW_FRAMERATE = !DRAW_FRAMERATE;
  }

  if (KEYBOARD[I] || KEYBOARD[O]) {
    if (KEYBOARD[O]) {
      zoomout();
    } else if (KEYBOARD[I]) {
      zoomin();
    }
  }

  if (KEYBOARD[UP] || KEYBOARD[38] || KEYBOARD[DOWN] || KEYBOARD[40] ||
    KEYBOARD[LEFT] || KEYBOARD[37] || KEYBOARD[RIGHT] || KEYBOARD[39]) {
    e.preventDefault();
  }

  if (KEYBOARD[SHIFT]) {
    actor.weapon = (actor.weapon + 1) % WEAPONS.length;
  }
  if (!SMOOTH_SHOOTING && KEYBOARD[SPACE]) {
      e.preventDefault();
      shoot(actor, PROJECTILES);
  }

  // cowboy is far from horse and cowboy is whistling.
  if (KEYBOARD[F]) {
    if (Math.abs(actor.x - HORSE.x) > 5 ||
        Math.abs(actor.y - HORSE.y) > 5) {
      // make horse run to cowboy.
      set_waypoint(HORSE, COWBOY.x, COWBOY.y);
    }
  }

  if (KEYBOARD[ENTER] || KEYBOARD[E] || KEYBOARD[F]) {
    // horse
    if (HORSE.alive) {
      // Cowboy is on horse.
      if (!HORSE.unbridled) {
        HORSE.unbridle();
      // Cowboy is near horse
      } else if (Math.abs(actor.x - HORSE.x) < 15 &&
          Math.abs(actor.y - HORSE.y) < 15) {
        HORSE.bridle();
      }
    }
    // outhouse
    if (actor_distance(COWBOY, OUTHOUSE) < 15) {
      OUTHOUSE.open = !OUTHOUSE.open;
    }
  }
}

