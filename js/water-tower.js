function build_watertower() {
  var tower = {
    image: function () {
      return IMAGES["watertower"];
    },
    x: -70,
    y: -150,
    isStatic: true,
    label: function() { return "water tower"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  DRAWABLES.push(tower);
}

