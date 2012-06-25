var ALPHA = {
  start: [0, 5],
  a: [5, 7],
  b: [12, 7],
  c: [19, 7],
  end: [194, 5]
};

function print(c, str, x, y) {
  var print_char = function(key) {
    var sprite_x = ALPHA[key][0],
        width = ALPHA[key][1];
        img = SPRITE.getImageData(sprite_x, 0, width, 16);
    c.putImageData(img, x, y);
    x += width;
  }

  print_char("start");
  for (var i = 0; i < str.length; i++) {
    print_char(str.charAt(i));
  }
  print_char("end");
}

