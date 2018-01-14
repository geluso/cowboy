var BACKGROUND = [];
var CHUNK_SIZE = 1000;
var DRAW_CHUNK_BORDERS = false;

// "0,0": []
var CHUNKS = {};

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

      if (CHUNKS[chunk] === undefined) {
        generateChunk(chunk);
      }
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

function registerActorInChunk(actor) {
  var pos = positionToChunkKey(actor.x, actor.y);
  if (CHUNKS[pos] === undefined) {
    CHUNKS[pos] = [];
  }
  CHUNKS[pos].push(actor);
}

function getCurrentChunk() {
  let key = positionToChunkKey(COWBOY.x, COWBOY.y)
  return CHUNKS[key]
}

function generateChunk(pos) {
  var x = Number(pos.split(",")[0]);
  var y = Number(pos.split(",")[1]);

  if (CHUNKS[pos]) {
    return CHUNKS[pos];
  } else {
    var chunkContents = [];

    var cacti = grow_cactus(x, y, CHUNK_SIZE, CHUNK_SIZE);
    var rocks = place_rocks(x, y, CHUNK_SIZE, CHUNK_SIZE);

    // random chance that the chunk will have a heart of cows.
    if (Math.random() < .3) {
      createCowHerd(x, y);
    }

    chunkContents = _.union(cacti, rocks);

    CHUNKS[pos] = chunkContents;
    return chunkContents;
  }
}
