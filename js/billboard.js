function build_billboard() {
  var billboardFrame = 1;
  setInterval(function() {
    billboardFrame++}
  , 1000);

  var billboard = {
    image: function () {
      return IMAGES["billboard_" + billboardFrame % 4];
    },
    x: 50,
    y: -100,
    isStatic: false,
    label: function() { return "$4 cowboy killers!!"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  DRAWABLES.push(billboard);
}
