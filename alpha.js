var ALPHA = {
  end: [0, 4],
  start: [4, 5],
  a: [9, 7],
  b: [16, 7],
  c: [23, 7],
  d: [30, 7],
  e: [37, 6],
  f: [43, 6],
  g: [49, 7],
  h: [56, 7],
  i: [63, 7],
  j: [70, 7],
  k: [77, 7],
  l: [84, 6],
  m: [90, 10],
  n: [100, 9],
  o: [109, 7],
  p: [116, 7],
  q: [123, 9],
  r: [132, 7],
  s: [139, 7],
  t: [146, 7],
  u: [153, 7],
  v: [160, 7],
  w: [167, 11],
  x: [178, 7],
  y: [185, 7],
  z: [192, 7],
  ":": [199, 3],
  ";": [203, 4],
  ".": [206, 3],
  ",": [209, 4],
  "'": [213, 3],
  "!": [216, 5],
  "?": [221, 7],
  "\"": [228, 6],
  "\"": [234, 6],
  " ": [240, 4],
};

CACHE = {};
var SCRATCH;

function tick() {
  
}

function text(str, x, y) {
  write(TEXT_CTX);
}

function notification(str, x, y) {

}

var DRAW_HELP_TEXT = true;

setTimeout(function() {
  DRAW_HELP_TEXT = false;
}, 10000);

function draw_help_text() {
  var messages = [
    "Welcome to Cowboy",
    "use WASD or arrow keys to move around",
    "press X to toggle this screen",
    "press SPACE to shoot",
    "press shift to switch weapons",
    "press E or Enter to mount horse",
    "press f to whistle horse over",
    "tap f to have horse giddy up",
    "click once to go somewhere",
    "click many times to have cowboy giddy up",
    "click and drag to have cowboy follow path",
  ];

  var width = 500;
  var height = 400;

  var leftOffset = WIDTH / 2 - width / 2;
  var topOffset = HEIGHT / 2 - height / 2;

  var textLeft = leftOffset + 150;
  var textTop = topOffset + 150 - 60;
  var spacer = 20;

  TEXT_CTX.drawImage(IMAGES["totem_half"], leftOffset, topOffset);
  TEXT_CTX.drawImage(IMAGES["logo"], leftOffset + 150, topOffset - 60);
  TEXT_CTX.drawImage(IMAGES["pole_half"], leftOffset + 400 + 20, topOffset);

  for (var i = 0; i < messages.length; i++) {
    write(TEXT_CTX, messages[i], textLeft, textTop + i * spacer);
  }
}

var DRAW_HELP_TEXT = true;
function label(str, x, y) {
  if (DRAW_HELP_TEXT) {
    draw_help_text();
  }

  write(TEXT_CTX, str, x, y);
}

// Writes the given string vertically centered at the given point.
function write(canvas, str, x, y) {
  str = str.toLowerCase();
  if (!CACHE[str]) {
    etch(str);
  }
  var image = CACHE[str];
  canvas.putImageData(image, x, y - image.height / 2);
}

function etch(str) {
  var cursor = 0;
  var etch_char = function(key) {
    var sprite_x = ALPHA[key][0],
        width = ALPHA[key][1];
        img = SPRITE.getImageData(sprite_x, 0, width, 16);
    SCRATCH.putImageData(img, cursor, 0);
    cursor += width;
  }

  etch_char("start");
  for (var i = 0; i < str.length; i++) {
    etch_char(str.charAt(i));
  }
  etch_char("end");

  CACHE[str] = SCRATCH.getImageData(0, 0, cursor, 16); 
}
