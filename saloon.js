function build_saloon() {
  var saloon = {
    image: function () {
      return IMAGES["saloon"];
    },
    x: 340,
    y: -82,
    label: function() { return "saloon"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  DRAWABLES.push(saloon);
}
