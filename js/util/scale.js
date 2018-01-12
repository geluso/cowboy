var SCALE_WIDTH;
var SCALE_HEIGHT;

var ZOOMIN = {
  1: .5,
  .5: .2,
  .2: .1,
  .1: .1
};

var ZOOMOUT = {
  2: 4,
  1: 2,
  .5: 1,
  .2: .5,
  .1: .2
};

function zoomin() {
  setScale(ZOOMIN[SCALE]);
}

function zoomout() {
  setScale(ZOOMOUT[SCALE]);
}

function setScale(scale) {
  scale = Math.min(scale, 4);
  scale = Math.max(scale, .1);

  SCALE = Number(scale.toFixed(2));

  if (isNaN(SCALE)) {
    SCALE = 1;
  }

  $("#zoomlevel").val(SCALE);

  SCALE_WIDTH = scale * ORIGINAL_WIDTH;
  SCALE_HEIGHT = scale * ORIGINAL_HEIGHT;

  // why is this here?
  if (!SCALE_WIDTH) {
    SCALE_HEIGHT = SCALE_WIDTH;
  }

  var background = document.getElementById("restworld");
  background.width = SCALE_WIDTH;
  background.height = SCALE_HEIGHT;
  var back_ctx = background.getContext("2d");
  back_ctx.width = SCALE_WIDTH;
  back_ctx.height = SCALE_HEIGHT;

  var foreground = document.getElementById("westworld");
  foreground.width = SCALE_WIDTH;
  foreground.height = SCALE_HEIGHT;
  var fore_ctx = foreground.getContext("2d");
  fore_ctx.width = SCALE_WIDTH;
  fore_ctx.height = SCALE_HEIGHT;
};

