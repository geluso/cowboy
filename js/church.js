function build_church() {
  var church = {
    image: function () {
      return IMAGES["church"];
    },
    x: 680,
    y: 0,
    isStatic: true,
    label: function() { return "repent!"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  DRAWABLES.push(church);
}
