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
