var OUTHOUSE;

function light_fire(ctx, a) {
  var FIRE = {
    image: function () {
      return IMAGES["fire"];
    },
    x: 0,
    y: 0,
    label: function() { return "campfire"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  }
  a.push(FIRE);
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
    x: 100,
    y: 120,
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

