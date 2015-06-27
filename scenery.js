var OUTHOUSE;

function light_fire(ctx, a, x, y) {
  var fire = {
    image: function () {
      return IMAGES["fire"];
    },
    x: x,
    y: y,
    label: function() { return "campfire"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  }
  a.push(fire);
}

function grow_cactus(ctx, a) {
  var cactus = 4 * (Math.random() * 150 + 20);
  var cactus_types = ["cactus_large", "cactus_large_flower", "cactus_med",
      "cactus_med_flower"];
  for (var i = 0; i < cactus; i++) {
    var choice = Math.floor(Math.random() * (cactus_types.length - 1));
    var cactus_type = cactus_types[choice];

    var x = Math.floor(Math.random() * WIDTH);
    var y = Math.floor(Math.random() * HEIGHT);

    if (Math.random() < .5) {
      x = -x;
    }
    if (Math.random() < .5) {
      y = -y;
    }

    a.push({
      image: function () {
        return IMAGES[this.type];
      },
      x: Math.floor(x),
      y: Math.floor(y),
      type: cactus_type,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }
}

function place_rocks(ctx, a) {
  var rocks = 4 * (Math.random() * 300 + 40);
  for (var i = 0; i < rocks; i++) {

    var x = Math.floor(Math.random() * WIDTH);
    var y = Math.floor(Math.random() * HEIGHT);

    if (Math.random() < .5) {
      x = -x;
    }
    if (Math.random() < .5) {
      y = -y;
    }

    a.push({
      image: function () {
        return IMAGES["rock"];
      },
      x: x,
      y: y,
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }
}

function build_outhouse(ctx, a) {
  OUTHOUSE = {
    image: function () {
      return this.open ? IMAGES["outhouse_open"] : IMAGES["outhouse_closed"]; 
    },
    x: 85,
    y: 45,
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


function place_tipee(ctx, a, x, y) {
  var tipee = {
    image: function () {
      return IMAGES["tipee"]; 
    },
    x: x,
    y: y,
    label: function() { return "tipee"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(tipee);
}

function place_totem(ctx, a, x, y) {
  var totem = {
    image: function () {
      return IMAGES["totem"]; 
    },
    x: x,
    y: y,
    label: function() { return "totem"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(totem);
}
var NATIVE1;
var NATIVE2;
var NATIVE3;
function birth_natives(ctx, a) {
  place_tipee(ctx, a, 375, 280);
  place_tipee(ctx, a, 400, 300);
  light_fire(ctx, a, 360, 310);
  place_totem(ctx, a, 330, 290);

  NATIVE1 = birth_native_dude(ctx, a, 380, 340);
  NATIVE2 = birth_native_dude(ctx, a, 300, 300);
  NATIVE3 = birth_native_dude(ctx, a, 320, 330);
  birth_chief(ctx, a, 350, 350);
}

function birth_native_dude(ctx, a, x, y) {
  var nativedude = {
    alive: true,
    image: function () {
      return IMAGES["native"]; 
    },
    x: x,
    y: y,
    label: function() { return "native"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    },
    way_x: undefined,
    way_y: undefined,
    actions: [],
    step: function() {
      var step = .6;
      return step;
    },
    stop: function () {
      if (nativedude.actions) {
        clear_intervals(nativedude.actions);
      }
      nativedude.actions = [];
      nativedude.way_x = undefined;
      nativedude.way_y = undefined;

      if (!nativedude.alive) {
        return;
      }

      var delay = Math.random() * 10;
      var move = Math.random() * 10;

      if (move < 6) {
        // don't always pick a destination
        setTimeout(nativedude.stop, delay * 1000);
      } else {
        var x = 360;
        var y = 310;
        var spread = 75;

        if (Math.random() > .5) {
          x = x + Math.random() * spread;
        } else {
          x = x - Math.random() * spread;
        }

        if (Math.random() > .5) {
          y = y + Math.random() * spread;
        } else {
          y = y - Math.random() * spread;
        }

        set_waypoint(nativedude, x, y);
      }
    },
  };
  nativedude.stop();
  a.push(nativedude);
  return nativedude;
}

function birth_chief(ctx, a, x, y) {
  var chief = {
    image: function () {
      return IMAGES["native_chief"]; 
    },
    x: x,
    y: y,
    label: function() { return "chief"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(chief);
}
