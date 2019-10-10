var START_TIME = Date.now();

var TRANSLATE_X = 0;
var TRANSLATE_Y = 0;

// canvases
var BACK_CTX, FORE_CTX, TEXT_CTX, SPRITE, SCRATCH, MENU_CTX;
var IMAGES_LOADED = 0;

var TICKER = 0;
    TICKING = [];

var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;

// weapons
var PISTOL = 0,
    SHOTGUN = 1,
    TOMAHAWK = 2,
    ARROW = 3,
    WEAPONS = [PISTOL, SHOTGUN, TOMAHAWK, ARROW];

var canvas, ctx;

var DRAWABLES = [],
    PROJECTILES = [],
    KILLABLE = []
var INTERVALS = [];

window.onload = buildWorld;

window.onresize = resize;

function resize() {
  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;
  ORIGINAL_HEIGHT = HEIGHT;
  ORIGINAL_WIDTH = WIDTH;
  
  function configureCtx(ctx) {
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;
    ctx.width = WIDTH;
    ctx.height = HEIGHT;
  }

  var background = document.getElementById("restworld");
  var back_ctx = background.getContext("2d");
  configureCtx(back_ctx);
  background.width = WIDTH;
  background.height = HEIGHT;
  back_ctx.fillRect(0,0,WIDTH, HEIGHT);

  var foreground = document.getElementById("westworld");
  var fore_ctx = foreground.getContext("2d");
  configureCtx(fore_ctx);
  foreground.width = WIDTH;
  foreground.height = HEIGHT;

  var text = document.getElementById("textworld");
  var text_ctx = text.getContext("2d");
  configureCtx(text_ctx);
  TEXT_CTX = text_ctx;
  text.width = WIDTH;
  text.height = HEIGHT;

  var menu = document.getElementById("menuworld");
  var menu_ctx = menu.getContext("2d");
  configureCtx(menu_ctx);
  MENU_CTX = menu_ctx;
  menu.width = WIDTH;
  menu.height = HEIGHT;

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

var lastX = undefined;
var lastY = undefined;
function buildWorld() {
  resize();

  //Math.seedrandom("COWBOY!!");

  // Prevent highlighting things on the page.
  document.onselectstart = function () { return false; };

  var back_ctx = document.getElementById("restworld").getContext("2d");
  var fore_ctx = document.getElementById("westworld").getContext("2d");
  var text_ctx = document.getElementById("textworld").getContext("2d");

  BACK_CTX = back_ctx
  FORE_CTX = fore_ctx

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
  COWBOY = new Cowboy()
  KILLABLE.push(new Dog());
  generateBackground(back_ctx);
  generateStart(fore_ctx, DRAWABLES);

  // add the COWBOY to the list of characters last so he's always drawn on top
  KILLABLE.push(COWBOY);

  // start super zoomed in.
  setScale(START_SCALE);

  var lastFrame = Date.now();
  TICKER = setInterval(tickAndDraw, FRAMERATE);

  initMenu();
}

function tickAndDraw() {
  tick(COWBOY);
  prepDrawBackground();
  draw_labels();
  utilDraw();
}

function prepDrawBackground() {
  draw_clear(FORE_CTX);
  draw_clear(BACK_CTX);
  drawRouteEast(FORE_CTX)

  BACK_CTX.fillStyle = "#cccc66";
  BACK_CTX.fillRect(0, 0, SCALE_WIDTH, SCALE_HEIGHT);

  draw(FORE_CTX, DRAWABLES);
  draw(FORE_CTX, PROJECTILES);
  draw(FORE_CTX, KILLABLE);

  // no need to update background if cowboy hasn't moved.
  if (COWBOY.x !== lastX || COWBOY.y !== lastY) {
    drawBackground(BACK_CTX);
  }
}

function utilDraw() {
  if (COWBOY.x !== lastX || COWBOY.y !== lastY) {
    if (DRAW_CHUNK_BORDERS) {
      drawChunkBorders(BACK_CTX);
    }

    if (DRAW_NAV_GRID) {
      drawNavGrid(BACK_CTX);
    }
  }
  if (DRAW_COORDS) {
    var step = 75;
    for (var x = 0; x < WIDTH; x += step) {
      for (var y = 0; y < HEIGHT; y += step) {
        FORE_CTX.fillText("x:" + x +", y: " + y, x, y);
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
}

function generateBackground(ctx, a) {
  ctx.fillStyle = "#cccc66";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  var chunks = currentChunkKeys();
  _.each(chunks, function(chunk) {
    generateChunk(chunk);
  });
}

function generateStart(ctx, a) {
  light_fire(ctx, a, 50, 50);
  build_outhouse(ctx, a);
  birth_horse(ctx, KILLABLE);

  // reducing dependencies on ctx and a when creating new structures.
  buildCabin();
  buildCabinTown();
  build_station();
  build_saloon();
  build_mansion();
  build_bank();
  build_church();
  build_billboard();
  build_watertower();
  place_fence();

  (new Sign(430, 170, "this road goes east")).build();

  (new GeneralStore(460, 50)).build();

  a.push(new Prospector())
  birthCows(ctx, KILLABLE);
  //birthCrows(ctx, a);
  birth_natives(ctx, KILLABLE);
  bones(ctx, a);
  fishingHole(ctx, a);

  // create a guaranteed herd of cows near the start.
  createCowHerd(-200, -200);

  createNavMesh(DRAWABLES);
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
      if (d.collide) {
        d.collide(COWBOY.x, COWBOY.y)
      }
      d.draw(ctx);
    }
  }

  ctx.restore();
}

function draw_labels() {
  var labels = 0;

  const x = Math.round((REAL_MOUSE_X / ORIGINAL_WIDTH) * WIDTH);
  const y = Math.round((REAL_MOUSE_Y / ORIGINAL_HEIGHT) * HEIGHT);

  for (var i = 0; i < (DRAWABLES.length + KILLABLE.length); i++) {
    var drawable = DRAWABLES[i];
    if (i >= DRAWABLES.length) {
      drawable = KILLABLE[i - DRAWABLES.length]
    }
    if (drawableContains(drawable, MOUSE_X, MOUSE_Y)) {
    //if (distance(drawable.x, drawable.y, MOUSE_X, MOUSE_Y) < 20) {
      label(drawable.label, x, y + labels * 18);
      return
    }
  }
  // if it didn't return in the for loop then draw
  // coords or GO
  if (SHOW_HOVER_COORDS) {
    drawScreenCoordinates(x, y);
  } else {
    label("go", x, y);
  }
}

function drawScreenCoordinates(x, y) {
  let coords = `(${MOUSE_X},${MOUSE_Y})`;
  label(coords, x, y);
}

function draw_actor(ctx, actor) {
  var image = actor.image,
      x = actor.x,
      y = actor.y;

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

function drawBackground(ctx) {
  var chunks = currentChunkKeys();
  _.each(chunks, function(chunkKey) {
    var chunk = CHUNKS[chunkKey];
    if (chunk) {
      draw(ctx, chunk);
    }
  }, this);
};

function tick(actor) {
  TICKER++;
  if (SMOOTH_SHOOTING && KEYBOARD[SPACE]) {
    shoot(actor, PROJECTILES);
  }

  if (actor.health !== undefined && actor.health <= 0) {
    return
  }

  var dx = 0;
  var dy = 0;

  console.log(KEYBOARD[KEYBOARD.J])
  if (KEYBOARD[UP] || KEYBOARD[38] || KEYBOARD[K]) {
    dy = -1;
    actor.direction = NORTH;
  }
  if (KEYBOARD[DOWN] || KEYBOARD[40] || KEYBOARD[J]) {
    dy = 1;
    actor.direction = SOUTH;
  }
  if (KEYBOARD[LEFT] || KEYBOARD[37] || KEYBOARD[H]) {
    dx = -1;
    actor.direction = WEST;
  }
  if (KEYBOARD[RIGHT] || KEYBOARD[39] || KEYBOARD[L]) {
    dx = 1;
    actor.direction = EAST;
  }
  if(actor.health) {
    let chunk = getCurrentChunk()
    for (var i = 0; i < chunk.length; i++) {
      var asset = chunk[i];
      if (asset.type && asset.type.includes("cactus")) {
        if (distance(COWBOY.x, COWBOY.y, asset.x, asset.y) < 20) {
          if (!asset.isRecentlyHit) {
            flashRed()
            asset.isRecentlyHit = true
            setTimeout(() => { asset.isRecentlyHit = false }, 1000)
            COWBOY.takeDamage(asset)
          }
        }
      }
    }
  }

  if (dx || dy) {
    actor.stop();
    stepActor(actor, dx, dy);
  }
}

function flashRed() {
  // setTimeout to zero to bring the flash outside the
  // normal draw cycle
  setTimeout(() => {
    TEXT_CTX.fillStyle = 'red'
    TEXT_CTX.fillRect(0, 0, WIDTH, HEIGHT)
  }, 0)
}

// dx and dy are either -1,0,1
function stepActor(actor, dx, dy) {
  var oldX = actor.x;
  var oldY = actor.y;

  var newX = actor.x;
  var newY = actor.y;
  var moved = false;

  if (dx) {
    newX = actor.x + actor.step() * dx;
  }
  if (dy) {
    newY = actor.y + actor.step() * dy;
  }

  if (validPosition(newX, newY)) {
    actor.x = newX;
    actor.y = newY;
    moved = true;
  } else if (validPosition(newX, actor.y)) {
    actor.x = newX;
    moved = true;
  } else if (validPosition(actor.x, newY)) {
    actor.y = newY;
    moved = true;
  }

  if(actor.health) {
    for (var i = 0; i < BACKGROUND.length; i++) {
      var asset = BACKGROUND[i];
      if (asset.image.src.includes("cactus")) {
        COWBOY.health -= 1
        console.log(COWBOY.health)
      }
    }
  }

  return moved;
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

  if (isInVisibleRect(actor.x, actor.y)) {
    if (actor.wake) {
      actor.wake()
    }
  } else {
    if (actor.sleep) {
      actor.sleep()
    }
  }

  if (Math.abs(actor.x - actor.way_x) <= actor.step() &&
      Math.abs(actor.y - actor.way_y) <= actor.step()) {
    actor.stop(route);
  } else {
    var dx = 0;
    var dy = 0;

    if ((actor.y + actor.step()) < actor.way_y) {
      dy = 1;
      actor.direction = SOUTH;
    } else if ((actor.y - actor.step()) > actor.way_y) {
      dy = -1;
      actor.direction = NORTH;
    }
    if ((actor.x + actor.step()) < actor.way_x) {
      dx = 1;
      actor.direction = EAST;
    } else if ((actor.x - actor.step()) > actor.way_x) {
      dx = -1;
      actor.direction = WEST;
    }

    if (dx || dy) {
      var moved = stepActor(actor, dx, dy);
      if (!moved) {
        actor.stop(route);
      } else {
      }
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

    if (asset.image.src.indexOf("cactus") !== -1) {

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
