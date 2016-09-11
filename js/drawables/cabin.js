var NUMBER_OF_CABINS = 12;
var CABIN_TOWN_X = -500;
var CABIN_TOWN_Y = -500;

function newCabin(x, y) {
  var cabin = new Drawable("cabin");
  cabin.setPosition(x, y);
  cabin.image = "cabin";
  cabin.build();
}

function buildCabin() {
  var cabin = newCabin(0, 0);
}

function buildCabinTown() {
  return
  for (var i = 0; i < NUMBER_OF_CABINS; i++) {
    var randomX = CABIN_TOWN_X * Math.random();
    var randomY = CABIN_TOWN_Y * Math.random();

    randomX = Math.round(randomX);
    randomY = Math.round(randomY);

    var cabin = newCabin(randomX, randomY);
  }
}
