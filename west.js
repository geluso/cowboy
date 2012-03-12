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

var OUTHOUSE, COWBOY, HORSE;
var DRAWABLES = [];
var SRC = [
  "cowboy",
  "cowboy_4x",
  "outhouse_open",
  "outhouse_closed",
  "cowboy",
  "rock",
  "cactus_large",
  "cactus_large_flower",
  "cactus_med",
  "cactus_med_flower",
  "horse",
  "cowboy_horse",
  "cowboy_horse_west",
  "fire"
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
  draw();
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
      return IMAGES["horse"];
    },
    x: 70,
    y: 40,
    draw: function (ctx) {
      if (this.unbridled) {
        ctx.drawImage(this.image(), this.x - this.image().width / 2, this.y - this.image().height);
      }
    },
    unbridled: true
  }
  DRAWABLES.push(HORSE);
}

function birth_cowboy() {
  COWBOY = {
    image: function () {
      if (this.horse) {
        if (this.west) {
          return IMAGES["cowboy_horse_west"]
        } else {
          return IMAGES["cowboy_horse"]
        }
      } else {
        return IMAGES["cowboy"];
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
      ctx.drawImage(this.image(), this.x - this.image().width / 2, this.y - this.image().height);
    }
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

function draw() {
  ctx.setFillColor("cccc66");
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (var i = 0; i < DRAWABLES.length; i++) {
    DRAWABLES[i].draw(ctx);
  }
}

function press(e, actor) {
  if (e.which == ENTER) {
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
    }
    if (e.keyCode == DOWN || e.keyCode == 40) {
      actor.y += actor.step() * 4;
    }
    if (e.keyCode == LEFT || e.keyCode == 37 ) {
      actor.x -= actor.step() * 4;
      actor.west = true;
    }
    if (e.keyCode == RIGHT || e.keyCode == 39 ) {
      actor.x += actor.step() * 4;
      actor.west = false;
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
  if (actor.way_x < actor.x) {
    actor.west = true;
  } else {
    actor.west = false;
  }
  actor.actions.push(setInterval(function () { walk(actor); }, FRAMERATE));
}

function walk(actor) {
  if (Math.abs(actor.x - actor.way_x) <= actor.step() &&
      Math.abs(actor.y - actor.way_y) <= actor.step()) {
    actor.stop();
  } else {
    if ((actor.x + actor.step()) < actor.way_x) {
      actor.x += actor.step();
    } else if ((actor.x - actor.step()) > actor.way_x) {
      actor.x -= actor.step();
    }
    if ((actor.y + actor.step()) < actor.way_y) {
      actor.y += actor.step();
    } else if ((actor.y - actor.step()) > actor.way_y) {
      actor.y -= actor.step();
    }
    draw();
  }
}

function clear_intervals(intervals) {
  for (var i = 0; i < intervals.length; i++) {
    clearInterval(intervals[i]);
  }
}
