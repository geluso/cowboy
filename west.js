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
var MOUSE_X = 0,
    MOUSE_Y = 0;

var KEYBOARD = {}
    UP = 87,
    DOWN = 83,
    LEFT = 65,
    RIGHT = 68,
    ENTER = 13,
    E = 69,
    F = 70,
    SPACE = 32,
    SHIFT = 16;

var OUTHOUSE, COWBOY, HORSE;
var DRAWABLES = [],
    BACKGROUND = [],
    PROJECTILES = [];
var SRC = [
  "cactus_large",
  "cactus_large_flower",
  "cactus_med",
  "cactus_med_flower",
  "rock",
  "bullet_north",
  "bullet_east",
  "bullet_south",
  "bullet_west",
  "cow_north",
  "cow_east",
  "cow_south",
  "cow_west",
  "cowboy_north",
  "cowboy_east",
  "cowboy_south",
  "cowboy_west",
  "cowboy_4x",
  "outhouse_open",
  "outhouse_closed",
  "horse_north",
  "horse_east",
  "horse_south",
  "horse_west",
  "cowboy_horse_north",
  "cowboy_horse_east",
  "cowboy_horse_south",
  "cowboy_horse_west",
  "fire",
  "tomahawk_north",
  "tomahawk_east",
  "tomahawk_south",
  "tomahawk_west",
  "arrow_north",
  "arrow_east",
  "arrow_south",
  "arrow_west",
  "dead_cow",
  "dead_horse",
  "bones",
];

var IMAGES = {};

var INTERVALS = [];

window.onload = buildWorld;

function buildWorld() {
  Math.seedrandom("COWBOY!!");

  WIDTH = window.innerWidth;
  HEIGHT = window.innerHeight;

  // Prevent highlighting things on the page.
  document.onselectstart = function () { return false; };

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

  var alphabet = new Image();
  alphabet.src = "img/alphabet.gif";
  SPRITE.drawImage(alphabet, 0, 0);

  for (var i = 0; i < SRC.length; i++) {
    var img = new Image();
    img.src = "img/" + SRC[i] + ".gif";
    IMAGES[SRC[i]] = img;
  }

  draw_background(back_ctx, BACKGROUND);

  draw_foreground(fore_ctx, DRAWABLES);

  $(document).keydown(function (e) {
    press(e, COWBOY);
  });
  $(document).keyup(function (e) {
    release(e, COWBOY);
  });

  $("#stack").mousemove(mousemove);
  $("#stack").mousedown(mousedown);
  $("#stack").mouseup(mouseup);
  $("#stack").click(click);
  
  TICKER = setInterval(function() {
    tick(COWBOY);
    draw_clear(fore_ctx);
    draw_clear(text_ctx);
    draw(fore_ctx, DRAWABLES);
    draw(fore_ctx, PROJECTILES);
    draw_labels();

    specialCactusDraw();
  }, FRAMERATE);

  TICKER = setInterval(function() {
    draw(back_ctx, BACKGROUND);
  }, 1000);

  $("#zoomin, #zoomout").click(function(e) {
    var scale = SCALE;
    if (e.target.id === "zoomin") {
      scale += .1;
    } else if (e.target.id === "zoomout") {
      scale -= .1;
    } else {
      scale = $("#zoomlevel").val();
    }

    scale = Math.min(scale, 20);
    scale = Math.max(scale, .1);

    SCALE = scale;
    $("#zoomlevel").val(SCALE);

    setScale(WIDTH * scale, HEIGHT * scale);
  });
}

function setScale(width, height) {
  if (!height) {
    height = width;
  }

  var background = document.getElementById("restworld");
  background.width = width;
  background.height = height;
  var back_ctx = background.getContext("2d");
  back_ctx.width = width;
  back_ctx.height = height;

  var foreground = document.getElementById("westworld");
  foreground.width = width;
  foreground.height = height;
  var fore_ctx = foreground.getContext("2d");
  fore_ctx.width = width;
  fore_ctx.height = height;

  var text = document.getElementById("textworld");
  text.width = width;
  text.height = height;
  var text_ctx = text.getContext("2d");
  text_ctx.width = width;
  text_ctx.height = height;

  draw_background(back_ctx, BACKGROUND);
};

function draw_background(ctx, a) {
  ctx.fillStyle = "#cccc66";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (a.length === 0) {
    grow_cactus(ctx, a);
    place_rocks(ctx, a);
  }
  draw(ctx, a);
}

function draw_foreground(ctx, a) {
  light_fire(ctx, a);
  build_outhouse(ctx, a);
  birth_horse(ctx, a);
  birth_cowboy(ctx, a);
  birth_cows(ctx, a);
  bones(ctx, a);
}

function draw_clear(ctx) {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function draw(ctx, drawables) {
  for (var i = 0; i < drawables.length; i++) {
    var d = drawables[i];
    if (d.x < 0 || d.y < 0 || d.x > WIDTH || d.y > HEIGHT) {
      drawables.splice(i, 1);
      i--;
    } else {
      d.draw(ctx);
    }
  }
}

function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function actor_distance(a1, a2) {
  return distance(a1.x, a1.y, a2.x, a2.y);
}

function draw_labels() {
  var labels = 0;
  for (var i = 0; i < DRAWABLES.length; i++) {
    var drawable = DRAWABLES[i];
    if (distance(drawable.x, drawable.y, MOUSE_X, MOUSE_Y) < 20) {
      label(drawable.label(), MOUSE_X + 15, MOUSE_Y + labels * 18);
      labels++
    }
  }
  if (labels == 0) {
    label("go", MOUSE_X + 15, MOUSE_Y);
  }
}

function draw_actor(ctx, actor) {
  var image = actor.image(),
      x = Math.floor(actor.x - image.width / 2),
      y = Math.floor(actor.y - image.height / 2);
  ctx.drawImage(image, x, y);
}

function build_outhouse(ctx, a) {
  OUTHOUSE = {
    image: function () {
      return this.open ? IMAGES["outhouse_open"] : IMAGES["outhouse_closed"]; 
    },
    x: 400,
    y: 300,
    open: false,
    label: function() { return "outhouse"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(OUTHOUSE);
}

function bones(ctx, a) {
  var bones = {
    image: function () {
      return IMAGES["bones"]; 
    },
    x: 600,
    y: 200,
    label: function() { return "BONE WARS"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(bones);
}

var COWS = [];
function birth_cows(ctx, a) {
  var total = 23;

  var x0 = WIDTH * .70;
  var y0 = HEIGHT * .55;
  for (var i = 0; i < total; i++) {
    x = x0 + Math.random() * 250;
    y = y0 + Math.random() * 250;
    cow = birth_cow(ctx, a, x, y);
    COWS.push(cow);
  }
}

function birth_cow(ctx, a, x, y) {
  var cow;
  cow = {
    image: function () {
      if (this.alive) {
        return IMAGES[["cow_north", "cow_east", "cow_south", "cow_west"][this.direction]];
      } else {
        return IMAGES["dead_cow"];
      }
    },
    x: x,
    y: y,
    way_x: undefined,
    way_y: undefined,
    actions: [],
    label: function() { return "cow"; },
    step: function() { return .6; },
    stop: function () {
      if (cow.actions) {
        clear_intervals(cow.actions);
      }
      cow.actions = [];
      cow.way_x = undefined;
      cow.way_y = undefined;

      if (!cow.alive) {
        return;
      }

      var delay = Math.random() * 10;
      var move = Math.random() * 10;
      if (move < 6) {
        // don't always pick a destination
        setTimeout(cow.stop, delay * 1000);
      } else {
        var x, y;
        if (Math.random() > .5) {
          x = cow.x + Math.random() * 100;
        } else {
          x = cow.x - Math.random() * 100;
        }

        if (Math.random() > .5) {
          y = cow.y + Math.random() * 100;
        } else {
          y = cow.y - Math.random() * 100;
        }

        set_waypoint(cow, x, y);
      }
    },
    draw: function (ctx) {
      if (this.way_x !== undefined && this.way_y !== undefined) {
          if (Math.abs(COWBOY.x - this.x) < 10 &&
              Math.abs(COWBOY.y - this.y) < 10) {
            this.bridle();
          }
      }

      if (!this.alive) {
        ctx.drawImage(this.image(),
            this.frame_width * this.frame, 0, this.frame_width, this.frame_height,
            this.x - Math.floor(this.frame_width / 2),
            this.y - Math.floor(this.frame_height / 2),
            this.frame_width, this.frame_height);
      } else if (this.unbridled) {
        draw_actor(ctx, this);
      }
    },
    alive: true,
    unbridled: true,
    direction: EAST,
    // death animation
    frame_width: 17,
    frame_height: 12,
    frames: 7,
    frame: 0,
    delay: 2000,
    bridle: function() {
        COWBOY.horse = true;
        this.unbridled = false;
        this.x = COWBOY.x;
        this.y = COWBOY.y;

        this.way_x = undefined;
        this.way_y = undefined;
    },
    unbridle: function() {
        COWBOY.horse = false;
        this.unbridled = true;
        this.x = COWBOY.x;
        this.y = COWBOY.y;
    },
    kill: function() {
      if (this.alive) {
        this.alive = false;
        this.decay(this);
      }
    },
    decay: function (actor) {
      actor.frame++;
      if (actor.frame < actor.frames) {
        setTimeout(function() {
          actor.decay(actor);
        }, actor.delay);
      }
    }
  }
  cow.stop();
  a.push(cow);

  return cow;
}

function birth_horse(ctx, a) {
  HORSE = {
    image: function () {
      if (this.alive) {
        return IMAGES[["horse_north", "horse_east", "horse_south", "horse_west"][this.direction]];
      } else {
        return IMAGES["dead_horse"];
      }
    },
    x: 70,
    y: 40,
    way_x: undefined,
    way_y: undefined,
    actions: [],
    label: function() { return "horse"; },
    step: function() { return 2; },
    stop: function () {
      clear_intervals(this.actions);
      this.actions = [];
      this.way_x = undefined;
      this.way_y = undefined;

      // if the cowboy is still far away then set a new waypoint toward him.
      if (Math.abs(COWBOY.x - HORSE.x) > 1 ||
          Math.abs(COWBOY.y - HORSE.y) > 1) {
        set_waypoint(HORSE, COWBOY.x, COWBOY.y);
      } else {
        HORSE.bridle();
      }
    },
    draw: function (ctx) {
      if (this.way_x !== undefined && this.way_y !== undefined) {
          if (Math.abs(COWBOY.x - HORSE.x) < 10 &&
              Math.abs(COWBOY.y - HORSE.y) < 10) {
            HORSE.bridle();
          }
      }

      if (!this.alive) {
        ctx.drawImage(this.image(),
            this.frame_width * this.frame, 0, this.frame_width, this.frame_height,
            this.x - Math.floor(this.frame_width / 2),
            this.y - Math.floor(this.frame_height / 2),
            this.frame_width, this.frame_height);
      } else if (this.unbridled) {
        draw_actor(ctx, this);
      }
    },
    alive: true,
    unbridled: true,
    direction: EAST,
    // death animation
    frame_width: 17,
    frame_height: 12,
    frames: 7,
    frame: 0,
    delay: 2000,
    bridle: function() {
        COWBOY.horse = true;
        HORSE.unbridled = false;
        HORSE.x = COWBOY.x;
        HORSE.y = COWBOY.y;

        HORSE.way_x = undefined;
        HORSE.way_y = undefined;
    },
    unbridle: function() {
        COWBOY.horse = false;
        HORSE.unbridled = true;
        HORSE.x = COWBOY.x;
        HORSE.y = COWBOY.y;
    },
    kill: function() {
      if (this.alive) {
        this.alive = false;
        this.decay(this);
      }
    },
    decay: function (actor) {
      actor.frame++;
      if (actor.frame < actor.frames) {
        setTimeout(function() {
          actor.decay(actor);
        }, actor.delay);
      }
    }
  }
  a.push(HORSE);
}

function birth_cowboy(ctx, a) {
  COWBOY = {
    image: function () {
      if (this.horse) {
        return IMAGES[["cowboy_horse_north", "cowboy_horse_east", "cowboy_horse_south", "cowboy_horse_west"][this.direction]];
      } else {
        return IMAGES[["cowboy_north", "cowboy_east", "cowboy_south", "cowboy_west"][this.direction]];
      }
    },
    x: 20,
    y: 20,
    way_x: undefined,
    way_y: undefined,
    actions: [],
    special_actions: [],
    trace_path: function() {
      var point = this.special_actions.shift();
      if (point) {
        set_waypoint(COWBOY, point[0], point[1], true);
      } else {
        this.stop();
      }
    },
    step: function () {
      if (this.horse) {
        return 2
      } else {
        return 1;
      }
    },
    stop: function (route) {
      clear_intervals(this.actions);
      if (route) {
        COWBOY.trace_path();
      } else {
        this.actions = [];
      }
    },
    horse: false,
    label: function () {
      if (this.horse) {
        return "cowboy on horse";
      } else {
        return "cowboy";
      }
    },
    draw: function (ctx) {
      draw_actor(ctx, this);
    },
    direction: EAST,
    weapon: PISTOL,
  }
  a.push(COWBOY);
}

function light_fire(ctx, a) {
  var FIRE = {
    image: function () {
      return IMAGES["fire"];
    },
    x: 30,
    y: 20,
    label: function() { return "campfire"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  }
  a.push(FIRE);
}

function grow_cactus(ctx, a) {
  var cactus = Math.random() * 150 + 20;
  var cactus_types = ["cactus_large", "cactus_large_flower", "cactus_med",
      "cactus_med_flower"];
  for (var i = 0; i < cactus; i++) {
    var choice = Math.floor(Math.random() * (cactus_types.length - 1))
    var cactus_type = cactus_types[choice];
    a.push({
      image: function () {
        return IMAGES[this.type];
      },
      x: Math.floor(Math.random() * WIDTH),
      y: Math.floor(Math.random() * HEIGHT),
      type: cactus_type,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }
}

function place_rocks(ctx, a) {
  var rocks = Math.random() * 300 + 40;
  for (var i = 0; i < rocks; i++) {
    a.push({
      image: function () {
        return IMAGES["rock"];
      },
      x: Math.floor(Math.random() * WIDTH),
      y: Math.floor(Math.random() * HEIGHT),
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }
}

function shoot(actor, drawables) {
  var image;
  if (actor.weapon == PISTOL) {
    image = ["bullet_north", "bullet_east", "bullet_south", "bullet_west"];
  } else if (actor.weapon == TOMAHAWK) {
    image = ["tomahawk_north", "tomahawk_east", "tomahawk_south", "tomahawk_west"];
  } else if (actor.weapon == ARROW) {
    image = ["arrow_north", "arrow_east", "arrow_south", "arrow_west"];
  }

  var dx = MOUSE_X - actor.x;
  var dy = MOUSE_Y - actor.y;
  var angle = Math.atan2(dy, dx);

  var projectile = {
    x: actor.x,
    y: actor.y - 10,
    angle: angle,
    image: function () {
      this.tick++;
      if (this.type == TOMAHAWK) {
        if (this.tick % 8 == 0) {
          this.direction = (this.direction + 1) % 4;
        }
      }
      return IMAGES[image[this.direction]];
    },
    draw: function (ctx) {
      this.x += this.speed * Math.cos(this.angle);
      this.y += this.speed * Math.sin(this.angle);
      ctx.drawImage(this.image(), this.x, this.y);
      if (HORSE.unbridled &&
            Math.abs(this.x - HORSE.x) < 7 &&
            Math.abs(this.y - HORSE.y) < 7) {
        HORSE.kill();
      }

      for (var i = 0; i < COWS.length; i++) {
        var cow = COWS[i];
        if (Math.abs(this.x - cow.x) < 7 &&
            Math.abs(this.y - cow.y) < 7) {
          cow.kill();
        }
      }
    },
    speed: actor.weapon == PISTOL ? 12 : 6,
    type: actor.weapon,
    tick: 0,
    timer: 100,
    direction: actor.direction,
  }
  drawables.push(projectile);
}

function release(e) {
  KEYBOARD[e.which] = false;
  KEYBOARD[e.keyCode] = false;
}

function press(e, actor) {
  KEYBOARD[e.which] = true;
  KEYBOARD[e.keyCode] = true;


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

var MOUSEDOWN = false;
var STACK_WAYPOINTS = [];
var traceCourseTimer = undefined;
var TRACE_COURSE = false;
var LAST_MOUSEUP;

var RANDOM;
function mousedown(e) {
  MOUSEDOWN = true;
  var random = Math.random();
  RANDOM = random;
  var traceCourseTimer = setTimeout(function() {
    if (MOUSEDOWN && RANDOM === random) {
      traceCourse();
    }
  }, 100);
}

function traceCourse() {
  STACK_WAYPOINTS = [];
  STACK_WAYPOINTS.push([MOUSE_X, MOUSE_Y]);
  TRACE_COURSE = true;
}
  
function mousemove(e) {
  MOUSE_X = e.offsetX;
  MOUSE_Y = e.offsetY;

  if (TRACE_COURSE) {
    STACK_WAYPOINTS.push([MOUSE_X, MOUSE_Y]);
  }
};


function mouseup(e) {
  MOUSEDOWN = false;
  if (TRACE_COURSE) {
    LAST_MOUSEUP = (new Date()).getTime();

    var point = STACK_WAYPOINTS.shift();
    COWBOY.special_actions = STACK_WAYPOINTS;
    COWBOY.trace_path();
  }

  TRACE_COURSE = false;
}

function click(e) {
  // prevent clicks from counting immediately after recording routes.
  var now = (new Date()).getTime();
  if (now - LAST_MOUSEUP < 500) {
    return;
  }

  var x = e.offsetX;
  var y = e.offsetY;
  set_waypoint(COWBOY, x, y);
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
      fore_ctx.fillText(i, asset.x, 10 + asset.y + asset.image().height);

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
