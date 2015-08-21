function build_mansion() {
  var mansion = {
    image: function () {
      return IMAGES["mansion"];
    },
    x: 500,
    y: -82,
    isStatic: true,
    label: function() { return "mansion"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  DRAWABLES.push(mansion);
}
