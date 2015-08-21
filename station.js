function build_station() {
  var station = {
    image: function () {
      return IMAGES["station"];
    },
    x: 200,
    y: -100,
    label: function() { return "station"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  DRAWABLES.push(station);
}
