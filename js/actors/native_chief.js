function birth_chief(ctx, a, x, y) {
  var chief = {
    get image() {
      return IMAGES["native_chief"]; 
    },
    x: x,
    y: y,
    get label() { return "chief"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };
  a.push(chief);
}