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

function label(str, x, y) {
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
