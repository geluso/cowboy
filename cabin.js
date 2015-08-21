function build_cabin() {
  var cabin = {
    image: function () {
      return IMAGES["cabin"];
    },
    x: 0,
    y: 0,
    label: function() { return "cabin"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  DRAWABLES.push(cabin);
}
