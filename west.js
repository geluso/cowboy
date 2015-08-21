var TRANSLATE_X = 0;
var TRANSLATE_Y = 0;

// canvases
var TEXT_CTX, SPRITE, SCRATCH;
var IMAGES_LOADED = 0;

var TICKER = 0;
    TICKING = [];

var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;

// weapons
var PISTOL = 0,
    TOMAHAWK = 1,
    ARROW = 2,
    WEAPONS = [PISTOL, TOMAHAWK, ARROW];

var canvas, ctx;

var DRAWABLES = [],
    PROJECTILES = [];
var INTERVALS = [];

window.onload = buildWorld;

window.onresize = resize;

function resize() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  ORIGINAL_HEIGHT = HEIGHT;
  ORIGINAL_WIDTH = WIDTH;

  var background = document.getElementById("restworld");
  var back_ctx = background.getContext("2d");
  background.width = WIDTH;
  background.height = HEIGHT;
  back_ctx.width = WIDTH;
  back_ctx.height = HEIGHT;
  back_ctx.fillRect(0,0,WIDTH, HEIGHT);

  var foreground = document.getElementById("westworld");
  var fore_ctx = foreground.getContext("2d");
  foreground.width = WIDTH;
  foreground.height = HEIGHT;
  fore_ctx.width = WIDTH;
  fore_ctx.height = HEIGHT;

  var text = document.getElementById("textworld");
  var text_ctx = text.getContext("2d");
  TEXT_CTX = text_ctx;
  text.width = WIDTH;
  text.height = HEIGHT;
  TEXT_CTX.width = WIDTH;
  TEXT_CTX.height = HEIGHT;

  SPRITE = document.getElementById("sprite");
  SPRITE.width = WIDTH;
  SPRITE.height = HEIGHT;
  SPRITE = SPRITE.getContext("2d");
  SPRITE.width = WIDTH;
  SPRITE.height = HEIGHT;

  SCRATCH = document.getElementById("scratch");
  SCRATCH.width = WIDTH;
  SCRATCH.height = HEIGHT;
  SCRATCH = SCRATCH.getContext("2d");
  SCRATCH.width = WIDTH;
  SCRATCH.height = HEIGHT;

  setScale(SCALE);
}

function buildWorld() {
  resize();

  Math.seedrandom("COWBOY!!");

  // Prevent highlighting things on the page.
  document.onselectstart = function () { return false; };

  var back_ctx = document.getElementById("restworld").getContext("2d");
  var fore_ctx = document.getElementById("westworld").getContext("2d");
  var text_ctx = document.getElementById("textworld").getContext("2d");

  SPRITE = document.getElementById("sprite").getContext("2d");
  SCRATCH = document.getElementById("scratch").getContext("2d");

  var alphabet = new Image();
  alphabet.src = "img/alphabet.gif";
  SPRITE.drawImage(alphabet, 0, 0);

  for (var i = 0; i < SRC.length; i++) {
    var img = new Image();
    img.src = "img/" + SRC[i] + ".gif";
    IMAGES[SRC[i]] = img;
  }

  // super important that cowboy is born before anything is drawn.
  birth_cowboy(ctx, DRAWABLES);
  draw_background(back_ctx, BACKGROUND);
  draw_foreground(fore_ctx, DRAWABLES);

  // shift the cowboy from the front to the back so he is always drawn last.
  DRAWABLES.push(DRAWABLES.shift());

  // start super zoomed in.
  setScale(START_SCALE);

  var lastFrame = Date.now();
  var lastX = undefined;
  var lastY = undefined;
  TICKER = setInterval(function() {
    tick(COWBOY);

    draw_clear(fore_ctx);
    draw_clear(back_ctx);

    back_ctx.fillStyle = "#cccc66";
    back_ctx.fillRect(0, 0, WIDTH, HEIGHT);

    draw(fore_ctx, DRAWABLES);
    draw(fore_ctx, PROJECTILES);

    // no need to update background if cowboy hasn't moved.
    if (COWBOY.x !== lastX || COWBOY.y !== lastY) {
      draw(back_ctx, BACKGROUND);

      if (DRAW_CHUNK_BORDERS) {
        drawChunkBorders(back_ctx);
      }

      if (DRAW_NAV_GRID) {
        drawNavGrid(back_ctx);
      }
    }

    draw_labels();

    if (DRAW_COORDS) {
      var step = 75;
      for (var x = 0; x < WIDTH; x += step) {
        for (var y = 0; y < HEIGHT; y += step) {
          fore_ctx.fillText("x:" + x +", y: " + y, x, y);
        }
      }
    }

    if (SPECIAL_CACTUS_DRAW) {
      specialCactusDraw();
    }

    if (DRAW_FRAMERATE) {
      var now = Date.now();
      var dt = Date.now() - lastFrame;
      lastFrame = now;

      var framerate = Math.round(1000 / dt);
      var text = framerate + " fps";
      fore_ctx.strokeText(text, 50, 50);
    }
  }, FRAMERATE);
}

function draw_background(ctx, a) {
  ctx.fillStyle = "#cccc66";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (a.length === 0) {
    grow_cactus(ctx, a);
    place_rocks(ctx, a);
    place_fence(ctx, a);
  }
  draw(ctx, a);
}

function draw_foreground(ctx, a) {
  light_fire(ctx, a, 50, 50);
  build_outhouse(ctx, a);
  birth_horse(ctx, a);
  birth_cows(ctx, a);

  // reducing dependencies on ctx and a when creating new structures.
  buildCabin();
  buildCabinTown();
  build_station();
  build_saloon();
  build_mansion();

  birth_natives(ctx, a);

  bones(ctx, a);
}

function draw_clear(ctx) {
  ctx.clearRect(0, 0, SCALE * WIDTH, SCALE * HEIGHT);
}

function draw(ctx, drawables) {
  ctx.save();

  TRANSLATE_X = ((SCALE * WIDTH) / 2 - COWBOY.x);
  TRANSLATE_Y = ((SCALE * HEIGHT) / 2 - COWBOY.y);
  ctx.translate(TRANSLATE_X, TRANSLATE_Y);

  for (var i = 0; i < drawables.length; i++) {
    var d = drawables[i];

    var xOffscreen = Math.abs(d.x - COWBOY.x) > WIDTH / 2;
    var yOffscreen = Math.abs(d.y - COWBOY.y) > HEIGHT / 2;

    if (drawables === PROJECTILES && (xOffscreen || yOffscreen)) {
      drawables.splice(i, 1);
      i--;
    } else {
      d.draw(ctx);
    }
  }

  ctx.restore();
}

function draw_labels() {
  var labels = 0;

  var x = Math.round((REAL_MOUSE_X / ORIGINAL_WIDTH) * WIDTH);
  var y = Math.round((REAL_MOUSE_Y / ORIGINAL_HEIGHT) * HEIGHT);

  for (var i = 0; i < DRAWABLES.length; i++) {
    var drawable = DRAWABLES[i];
    if (distance(drawable.x, drawable.y, MOUSE_X, MOUSE_Y) < 20) {
      label(drawable.label(), x, y + labels * 18);
      labels++
    }
  }
  if (labels == 0) {
    label("go", x, y);
  }
}

function draw_actor(ctx, actor) {
  var image = actor.image(),
      x = Math.floor(actor.x - image.width / 2),
      y = Math.floor(actor.y - image.height / 2);

  if (!DRAW_BOUNDING_BOXES) {
    ctx.drawImage(image, x, y);
  } else {
    if (actor.isStatic || !ONLY_STATIC_BOUNDING_BOXES) {
      ctx.fillStyle = 'black';
      ctx.fillRect(x, y, image.width, image.height);
    } else {
      ctx.drawImage(image, x, y);
    }
  }
}

function tick(actor) {
  TICKER++;
  if (SMOOTH_SHOOTING && KEYBOARD[SPACE]) {
    shoot(actor, PROJECTILES);
  }
  if (KEYBOARD[UP] || KEYBOARD[38]) {
    actor.y -= actor.step();
    actor.direction = NORTH;
    actor.stop();
  }
  if (KEYBOARD[DOWN] || KEYBOARD[40]) {
    actor.y += actor.step();
    actor.direction = SOUTH;
    actor.stop();
  }
  if (KEYBOARD[LEFT] || KEYBOARD[37]) {
    actor.x -= actor.step();
    actor.direction = WEST;
    actor.stop();
  }
  if (KEYBOARD[RIGHT] || KEYBOARD[39]) {
    actor.x += actor.step();
    actor.direction = EAST;
    actor.stop();
  }
}

// Sets a destination for the cowboy, and makes him move toward it.
function set_waypoint(actor, x, y, route) {
  actor.way_x = x;
  actor.way_y = y;

  var interval = setInterval(function () { walk(actor, route); }, FRAMERATE)
  actor.actions.push(interval);
  return interval;
}

function walk(actor, route) {
  if (!actor.alive && actor !== COWBOY) {
    return;
  }

  if (Math.abs(actor.x - actor.way_x) <= actor.step() &&
      Math.abs(actor.y - actor.way_y) <= actor.step()) {
    actor.stop(route);
  } else {
    if ((actor.y + actor.step()) < actor.way_y) {
      actor.y += actor.step();
      actor.direction = SOUTH;
    } else if ((actor.y - actor.step()) > actor.way_y) {
      actor.y -= actor.step();
      actor.direction = NORTH;
    }
    if ((actor.x + actor.step()) < actor.way_x) {
      actor.x += actor.step();
      actor.direction = EAST;
    } else if ((actor.x - actor.step()) > actor.way_x) {
      actor.x -= actor.step();
      actor.direction = WEST;
    }
  }

  actor.x = Math.round(actor.x);
  actor.y = Math.round(actor.y);

  actor.chunk = positionToChunkKey(actor.x, actor.y);

  if (actor.walkFinished) {
    actor.walkFinished();
  }
}

function clear_intervals(intervals) {
  for (var i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
}

function specialCactusDraw() {
  var foreground = document.getElementById("westworld");
  var fore_ctx = foreground.getContext("2d");
  for (var i = 0; i < BACKGROUND.length; i++) {
    var asset = BACKGROUND[i];

    if (asset.image().src.indexOf("cactus") !== -1) {

      if (Math.abs(asset.x - COWBOY.x) < 20 &&
          Math.abs(asset.y - COWBOY.y) < 20) {
        if (COWBOY.y > asset.y) {
          asset.draw(fore_ctx);
          COWBOY.draw(fore_ctx);
        } else {
          COWBOY.draw(fore_ctx);
          asset.draw(fore_ctx);
        }
      }
    }
  }
}
