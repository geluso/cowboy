var NUMBER_OF_CABINS = 12;
var CABIN_TOWN_X = -500;
var CABIN_TOWN_Y = -500;

function newCabin(x, y) {
  var cabin = {
    image: function () {
      return IMAGES["cabin"];
    },
    x: x,
    y: y,
    label: function() { return "cabin"; },
    draw: function (ctx) {
      draw_actor(ctx, this);
    }
  };

  return cabin;
}

function buildCabin() {
  var cabin = newCabin(0, 0);
  DRAWABLES.push(cabin);
}

function buildCabinTown() {
  for (var i = 0; i < NUMBER_OF_CABINS; i++) {
    var randomX = CABIN_TOWN_X * Math.random();
    var randomY = CABIN_TOWN_Y * Math.random();

    randomX = Math.round(randomX);
    randomY = Math.round(randomY);

    var cabin = newCabin(randomX, randomY);
    DRAWABLES.push(cabin);
  }
}
