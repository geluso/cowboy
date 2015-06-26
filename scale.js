var ZOOMIN = {
  1: .5,
  .5: .25,
  .25: .2,
  .2: .1,
  .1: .1
};

var ZOOMOUT = {
  1: 1,
  .5: 1,
  .25: .5,
  .2: .25,
  .1: .2
};

function zoomin() {
  setScale(ZOOMIN[SCALE]);
}

function zoomout() {
  setScale(ZOOMOUT[SCALE]);
}

function setScale(scale) {
  scale = Math.min(scale, 1);
  scale = Math.max(scale, .1);

  SCALE = Number(scale.toFixed(2));

  if (isNaN(SCALE)) {
    SCALE = 1;
  }

  $("#zoomlevel").val(SCALE);

  var width = scale * ORIGINAL_WIDTH;
  var height = scale * ORIGINAL_HEIGHT;

  if (!height) {
    height = width;
  }

  var background = document.getElementById("restworld");
  background.width = width;
  background.height = height;
  var back_ctx = background.getContext("2d");
  back_ctx.width = width;
  back_ctx.height = height;

  var foreground = document.getElementById("westworld");
  foreground.width = width;
  foreground.height = height;
  var fore_ctx = foreground.getContext("2d");
  fore_ctx.width = width;
  fore_ctx.height = height;

  var text = document.getElementById("textworld");
  text.width = width;
  text.height = height;
  var text_ctx = text.getContext("2d");
  text_ctx.width = width;
  text_ctx.height = height;
};

