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

var FRAMERATE = 1000 / 60;
var WIDTH = 800;
var HEIGHT = 600;

var canvas, ctx;
var SCALE = 1;

var MOUSE_X = 0,
    MOUSE_Y = 0;

var KEYBOARD = {}
    UP = 87,
    DOWN = 83,
    LEFT = 65,
    RIGHT = 68,
    ENTER = 13,
    E = 69,
    SPACE = 32,
    SHIFT = 16;

var SMOOTH_SHOOTING = false;

var OUTHOUSE, COWBOY, HORSE;
var DRAWABLES = [],
    BACKGROUND = [],
    PROJECTILES = [];
var SRC = [
  "bullet_north",
  "bullet_east",
  "bullet_south",
  "bullet_west",
  "cowboy_north",
  "cowboy_east",
  "cowboy_south",
  "cowboy_west",
  "cowboy_4x",
  "outhouse_open",
  "outhouse_closed",
  "rock",
  "cactus_large",
  "cactus_large_flower",
  "cactus_med",
  "cactus_med_flower",
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
  "dead_horse"
];

var IMAGES = {};

var INTERVALS = [];

var SPRITE;

window.onload = function () {
  Math.seedrandom("COWBOY!!");

  // Prevent highlighting things on the page.
  document.onselectstart = function () { return false; };

  var background = document.getElementById("background");
  var back_ctx = background.getContext("2d");
  background.width = WIDTH;
  background.height = HEIGHT;
  back_ctx.fillRect(0,0,WIDTH, HEIGHT);

  var foreground = document.getElementById("westworld");
  var fore_ctx = foreground.getContext("2d");
  foreground.width = WIDTH;
  foreground.height = HEIGHT;

  var text = document.getElementById("textworld");
  var text_ctx = text.getContext("2d");
  text.width = WIDTH;
  text.height = HEIGHT;

  SPRITE = document.getElementById("sprite");
  SPRITE.width = WIDTH;
  SPRITE.height = HEIGHT;
  SPRITE = SPRITE.getContext("2d");

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

  $("#stack").mousemove(function(e) {
    MOUSE_X = e.offsetX;
    MOUSE_Y = e.offsetY;
  });

  $("#stack").click(click);
  
  var alphabet = new Image();
  alphabet.src = "img/alphabet.gif";

  SPRITE.drawImage(alphabet, 0, 0);
  text_ctx.putImageData(SPRITE.getImageData(0, 0, alphabet.width, alphabet.height), 50, 50);

  print(text_ctx, "cab", 100, 100);

  TICKER = setInterval(function() {
    tick(COWBOY);
    draw_clear(fore_ctx);
    draw(fore_ctx, DRAWABLES);
    draw(fore_ctx, PROJECTILES);
  }, FRAMERATE);
}

function print(c, str, x, y) {
  var print_char = function(key) {
    var sprite_x = ALPHA[key][0],
        width = ALPHA[key][1];
        img = SPRITE.getImageData(sprite_x, 0, width, 16);
    c.putImageData(img, x, y);
    x += width;
  }

  print_char("start");
  for (var i = 0; i < str.length; i++) {
    print_char(str.charAt(i));
  }
  print_char("end");
}

function draw_background(ctx, a) {
  ctx.setFillColor("cccc66");
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  light_fire(ctx, a);
  grow_cactus(ctx, a);
  place_rocks(ctx, a);
  draw(ctx, a);
}

function draw_foreground(ctx, a) {
  build_outhouse(ctx, a);
  birth_horse(ctx, a);
  birth_cowboy(ctx, a);
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



function build_outhouse(ctx, a) {
  OUTHOUSE = {
    image: function () {
      return this.open ? IMAGES["outhouse_open"] : IMAGES["outhouse_closed"]; 
    },
    x: 400,
    y: 300,
    open: false,
    draw: function (ctx) {
      ctx.drawImage(this.image(), this.x, this.y);
    }
  };
  a.push(OUTHOUSE);
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
    draw: function (ctx) {
      if (!this.alive) {
        ctx.drawImage(this.image(),
            this.frame_width * this.frame, 0, this.frame_width, this.frame_height,
            this.x - Math.floor(this.frame_width / 2),
            this.y - Math.floor(this.frame_height / 2),
            this.frame_width, this.frame_height);
      } else if (this.unbridled) {
        ctx.drawImage(this.image(),
            this.x - Math.floor(this.image().width / 2),
            this.y - Math.floor(this.image().height / 2));
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
    step: function () {
      if (this.horse) {
        return 2
      } else {
        return 1;
      }
    },
    stop: function () {
      clear_intervals(this.actions);
      this.actions = [];
    },
    horse: false,
    draw: function (ctx) {
      ctx.drawImage(this.image(), Math.floor(this.x - this.image().width / 2), this.y - this.image().height);
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
    draw: function (ctx) {
      ctx.drawImage(this.image(), this.x, this.y);
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
  if (KEYBOARD[SHIFT]) {
    actor.weapon = (actor.weapon + 1) % WEAPONS.length;
  }
  if (!SMOOTH_SHOOTING && KEYBOARD[SPACE]) {
      shoot(actor, PROJECTILES);
  }
  if (KEYBOARD[ENTER] || KEYBOARD[E]) {
    // horse
    if (HORSE.alive) {
      if (!HORSE.unbridled) {
        actor.horse = !actor.horse;
        HORSE.unbridled = !HORSE.unbridled;
        HORSE.x = actor.x;
        HORSE.y = actor.y;
      } else if (Math.abs(actor.x - HORSE.x) < 15 &&
          Math.abs(actor.y - HORSE.y) < 15) {
        actor.horse = !actor.horse;
        HORSE.unbridled = !HORSE.unbridled;
      }
    }
    // outhouse
    if (Math.abs(actor.x - OUTHOUSE.x - OUTHOUSE.image().width / 2) < 15 &&
        Math.abs(actor.y - OUTHOUSE.y - OUTHOUSE.image().height) < 15) {
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

function click(e) {
  var x = e.offsetX;
  var y = e.offsetY;
  console.log("click!");
  set_waypoint(COWBOY, x, y);
}

// Sets a destination for the cowboy, and makes him move toward it.
function set_waypoint(actor, x, y) {
  actor.way_x = x;
  actor.way_y = y;
  actor.actions.push(setInterval(function () { walk(actor); }, FRAMERATE));
}

function walk(actor) {
  if (Math.abs(actor.x - actor.way_x) <= actor.step() &&
      Math.abs(actor.y - actor.way_y) <= actor.step()) {
    actor.stop();
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
