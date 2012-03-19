var TICKER;

var NORTH = 0;
var EAST = 1;
var SOUTH = 2;
var WEST = 3;

var PISTOL = 0;
var TOMAHAWK = 1;
var ARROW = 2;
var WEAPONS = [PISTOL, TOMAHAWK, ARROW];

var FRAMERATE = 1000 / 60;
var WIDTH = 800;
var HEIGHT = 600;

var canvas, ctx;
var SCALE = 1;

var UP = 87;
var DOWN = 83;
var LEFT = 65;
var RIGHT = 68;
var ENTER = 13;
var SPACE = 32;
var SHIFT = 16;

var OUTHOUSE, COWBOY, HORSE;
var DRAWABLES = [];
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
  "arrow_west"
];
var IMAGES = {};

var INTERVALS = [];

window.onload = function () {
  // Prevent highlighting things on the page.
  document.onselectstart = function () { return false; };

  canvas = document.getElementById("westworld");
  ctx = canvas.getContext("2d");

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  for (var i = 0; i < SRC.length; i++) {
    var img = new Image();
    img.src = "img/" + SRC[i] + ".gif";
    IMAGES[SRC[i]] = img;
  }

  populate_world();
  $(document).keydown(function (e) {
    press(e, COWBOY);
  });
  $("#westworld").click(click);
  
  setInterval(draw, FRAMERATE);
}

function populate_world() {
  build_outhouse();
  light_fire();
  grow_cactus();
  place_rocks();
  birth_horse();
  birth_cowboy();
}

function build_outhouse() {
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
  DRAWABLES.push(OUTHOUSE);
}

function birth_horse() {
  HORSE = {
    image: function () {
      return IMAGES[["horse_north", "horse_east", "horse_south", "horse_west"][this.direction]];
    },
    x: 70,
    y: 40,
    draw: function (ctx) {
      if (this.unbridled) {
        ctx.drawImage(this.image(), this.x - this.image().width / 2, this.y - this.image().height);
      }
    },
    unbridled: true,
    direction: EAST
  }
  DRAWABLES.push(HORSE);
}

function birth_cowboy() {
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
  DRAWABLES.push(COWBOY);
}

function light_fire() {
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
  DRAWABLES.push(FIRE);
}

function grow_cactus() {
  var cactus = Math.random() * 150 + 20;
  var cactus_types = ["cactus_large", "cactus_large_flower", "cactus_med",
      "cactus_med_flower"];
  for (var i = 0; i < cactus; i++) {
    var choice = Math.round(Math.random() * (cactus_types.length - 1))
    var cactus_type = cactus_types[choice];
    DRAWABLES.push({
      image: function () {
        return IMAGES[this.type];
      },
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      type: cactus_type,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }
}

function place_rocks() {
  var rocks = Math.random() * 300 + 40;
  for (var i = 0; i < rocks; i++) {
    DRAWABLES.push({
      image: function () {
        return IMAGES["rock"];
      },
      x: Math.random() * WIDTH,
      y: Math.random() * HEIGHT,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }
}

function shoot(weapon, x, y, direction) {
  var image;
  if (weapon == PISTOL) {
    image = ["bullet_north", "bullet_east", "bullet_south", "bullet_west"];
  } else if (weapon == TOMAHAWK) {
    image = ["tomahawk_north", "tomahawk_east", "tomahawk_south", "tomahawk_west"];
  } else if (weapon == ARROW) {
    image = ["arrow_north", "arrow_east", "arrow_south", "arrow_west"];
  }
  var projectile = {
    x: x,
    y: y - 10,
    way_x: [0, 1, 0, -1][direction],
    way_y: [-1, 0, 1, 0][direction],
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
      this.x += this.speed * this.way_x;
      this.y += this.speed * this.way_y;
      ctx.drawImage(this.image(), this.x, this.y);
    },
    speed: weapon == PISTOL ? 12 : 6,
    type: weapon,
    tick: 0,
    timer: 100,
    direction: direction,
  }
  DRAWABLES.push(projectile);
}

function draw() {
  ctx.setFillColor("cccc66");
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (var i = 0; i < DRAWABLES.length; i++) {
    var d = DRAWABLES[i];
    if (d.x < 0 || d.y < 0 || d.x > WIDTH || d.y > HEIGHT) {
      DRAWABLES.splice(i, 1);
      i--;
    } else {
      d.draw(ctx);
    }
  }
}

function press(e, actor) {
  if (e.which == SHIFT) {
    actor.weapon = (actor.weapon + 1) % WEAPONS.length;
  } else if (e.which == SPACE) {
    shoot(actor.weapon, actor.x, actor.y, actor.direction);
  } else if (e.which == ENTER) {
    // horse
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
    // outhouse
    if (Math.abs(actor.x - OUTHOUSE.x - OUTHOUSE.image().width / 2) < 15 &&
        Math.abs(actor.y - OUTHOUSE.y - OUTHOUSE.image().height) < 15) {
      OUTHOUSE.open = !OUTHOUSE.open;
    }
  } else {
    actor.stop();
    if (e.keyCode == UP || e.keyCode == 38) {
      actor.y -= actor.step() * 4;
      actor.direction = NORTH;
    }
    if (e.keyCode == DOWN || e.keyCode == 40) {
      actor.y += actor.step() * 4;
      actor.direction = SOUTH;
    }
    if (e.keyCode == LEFT || e.keyCode == 37 ) {
      actor.x -= actor.step() * 4;
      actor.direction = WEST;
    }
    if (e.keyCode == RIGHT || e.keyCode == 39 ) {
      actor.x += actor.step() * 4;
      actor.direction = EAST;
    }
  }
  draw();
}

function click(e) {
  var x = e.offsetX;
  var y = e.offsetY;
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
    draw();
  }
}

function clear_intervals(intervals) {
  for (var i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
}
