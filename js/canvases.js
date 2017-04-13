function init(layers) {
  for (var i = 0; i < layers.length; i++) {
    var layer = document.getElementById(layers[i]);
    background.width = WIDTH;
    background.height = HEIGHT;
    var ctx = background.getContext("2d");
    ctx.imageSmoothingEnabled = false;
  }
}
