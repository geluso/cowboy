function build_bank() {
  var bank = {
    image: function () {
      return IMAGES["bank"];
    },
    x: 320,
    y: 70,
    isStatic: true,
    label: function() { return "bank"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  DRAWABLES.push(bank);
}
