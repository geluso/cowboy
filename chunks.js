var BACKGROUND = [];
var CHUNK_SIZE = 1000;
var DRAW_CHUNK_BORDERS = true;

var CHUNKS = {
  "0,0": []
}

var positionToChunkKey = function(x, y) {
  x = Math.floor(x / CHUNK_SIZE);
  y = Math.floor(y / CHUNK_SIZE);

  return "" + CHUNK_SIZE * x + "," + CHUNK_SIZE * y;
}

var currentChunkKeys = function() {
  var x = x || COWBOY.x;
  var y = y || COWBOY.y;

  var x0 = x - WIDTH;
  var x1 = x + WIDTH;

  var y0 = y - HEIGHT;
  var y1 = y + HEIGHT;

  var chunks = [];
  for (var xx = x0; xx < x1 + CHUNK_SIZE; xx += CHUNK_SIZE) {
    for (var yy = y0; yy < y1 + CHUNK_SIZE; yy += CHUNK_SIZE) {
      var chunk = positionToChunkKey(xx, yy);
      chunks.push(chunk);
    }
  }
  return chunks;
}

function drawChunkBorders(ctx) {
  var keys = currentChunkKeys();
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    drawChunk(ctx, key);
  }
}

function drawChunk(ctx, key) {
  var x = Number(key.split(",")[0], 10);
  var y = Number(key.split(",")[1], 10);

  xg = gameXToScreenX(x);
  yg = gameYToScreenY(y);
  ctx.strokeStyle = "black";
  ctx.strokeRect(xg, yg, CHUNK_SIZE, CHUNK_SIZE);
}
