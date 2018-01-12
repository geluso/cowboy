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
