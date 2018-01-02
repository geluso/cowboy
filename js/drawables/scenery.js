var OUTHOUSE;

function light_fire(ctx, a, x, y) {
  var fire = {
    get image() {
      return IMAGES["fire"];
    },
    x: x,
    y: y,
    isStatic: true,
    get label() { return "campfire"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  }
  a.push(fire);
}

function grow_cactus(x, y, width, height) {
  var newCacti = [];

  var cactus = Math.random() * 30 + 15;
  var cactus_types = ["cactus_large", "cactus_large_flower", "cactus_med",
      "cactus_med_flower"];
  for (var i = 0; i < cactus; i++) {
    var cactus_type = _.sample(cactus_types);

    var xx = x + Math.floor(Math.random() * width);
    var yy = y + Math.floor(Math.random() * width);

    var newCactus = {
      get image() {
        return IMAGES[this.type];
      },
      x: Math.floor(xx),
      y: Math.floor(yy),
      isStatic: true,
      type: cactus_type,
      draw: function (ctx) {
        ctx.drawImage(this.image, this.x, this.y);
      }
    };
    newCacti.push(newCactus);
  }

  return newCacti;
}

function place_rocks(x, y, width, height) {
  var newRocks = [];

  var rocks = Math.random() * 30 + 50;
  for (var i = 0; i < rocks; i++) {

    var xx = x + Math.floor(Math.random() * width);
    var yy = y + Math.floor(Math.random() * height);

    var rock = {
      get image() {
        return IMAGES["rock"];
      },
      x: xx,
      y: yy,
      draw: function (ctx) {
        ctx.drawImage(this.image, this.x, this.y);
      }
    };

    newRocks.push(rock);
  }

  return newRocks;
}

function build_outhouse(ctx, a) {
  OUTHOUSE = {
    get image() {
      return this.open ? IMAGES["outhouse_open"] : IMAGES["outhouse_closed"]; 
    },
    x: 85,
    y: 45,
    isStatic: true,
    open: false,
    get label() { return "outhouse"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(OUTHOUSE);
}

function bones(ctx, a) {
  var bones = {
    get image() {
      return IMAGES["bones"]; 
    },
    x: 600,
    y: 200,
    get label() { return "BONE WARS"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(bones);
}

function oasis(ctx, a) {
  var oasis = {
    get image() {
      return IMAGES["oasis-large"]; 
    },
    x: 10000,
    y: 10000,
    get label() { return "OASIS"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  var oasis2 = {
    get image() {
      return IMAGES["oasis-tiny"]; 
    },
    x: 9500,
    y: 9500,
    get label() { return "TINY OASIS"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(oasis);
  a.push(oasis2);
}


function place_tepee(ctx, a, x, y) {
  var tepee = {
    get image() {
      return IMAGES["tepee"]; 
    },
    x: x,
    y: y,
    isStatic: true,
    get label() { return "tepee"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(tepee);
  return tepee;
}

function place_totem(ctx, a, x, y) {
  var totem = {
    get image() {
      return IMAGES["totem"]; 
    },
    x: x,
    y: y,
    isStatic: true,
    get label() { return "totem"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(totem);
}
var NATIVE1;
var NATIVE2;
var NATIVE3;
var NATIVES = [NATIVE1, NATIVE2, NATIVE3];

var TEPEE1, TEPEE1;

function birth_natives(ctx, a) {
  TEPEE1 = place_tepee(ctx, a, 375, 280);
  TEPEE2 = place_tepee(ctx, a, 400, 300);
  light_fire(ctx, a, 360, 310);
  place_totem(ctx, a, 330, 290);

  NATIVE1 = birth_native_dude(ctx, a, 380, 370);
  NATIVE2 = birth_native_dude(ctx, a, 300, 300);
  NATIVE3 = birth_native_dude(ctx, a, 320, 380);
  birth_chief(ctx, a, 350, 360);
}

function birth_native_dude(ctx, a, x, y) {
  var nativedude = {
    alive: true,
    get image() {
      return IMAGES["native"]; 
    },
    x: x,
    y: y,
    get label() { return "native"; },
    draw: function (ctx) {
      if (nativedude.inTent) {
        return;
      }
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

      if (nativedude.inTent) {
        // 50/50 chance to leave tent
        if (Math.random() < .5) {
          nativedude.inTent = false;
        }
      }

      // decide to go to tent
      if (move < .9) {
        nativedude.goingToTent = true;
        if (Math.random() < .5) {
          nativedude.destinationTent = TEPEE1;
        } else {
          nativedude.destinationTent = TEPEE2;
        }
        set_waypoint(nativedude, nativedude.destinationTent.x, nativedude.destinationTent.y);
      } else if (move < 6) {
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
    walkFinished: function() {
      if (!nativedude.destinationTent) {
        return;
      }
      if (nativedude.x === nativedude.destinationTent.x && 
          nativedude.y === nativedude.destinationTent.y) {
        nativedude.destinationTent = undefined;
        nativedude.goingToTent = false;
        nativedude.inTent = true;
      }
    }
  };
  nativedude.stop();
  a.push(nativedude);
  return nativedude;
}

function birth_chief(ctx, a, x, y) {
  var chief = {
    get image() {
      return IMAGES["native_chief"]; 
    },
    x: x,
    y: y,
    get label() { return "chief"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(chief);
}
