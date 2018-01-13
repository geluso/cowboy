function place_tepee(ctx, a, x, y) {
  var tepee = {
    get image() {
      return IMAGES["tepee"]; 
    },
    x: x,
    y: y,
    isStatic: false,
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

var TEPEE1, TEPEE1;

var NATIVE;
function birth_natives(ctx, a) {
  TEPEE1 = place_tepee(ctx, a, 375, 280);
  TEPEE2 = place_tepee(ctx, a, 400, 300);
  light_fire(ctx, a, 360, 310);
  place_totem(ctx, a, 330, 290);

  NATIVE = new Native(380, 370)
  a.push(NATIVE)
  a.push(new Native(300, 300));
  a.push(new Native(320, 380));
  a.push(new NativeChief(350, 360));
}
