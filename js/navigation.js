var NAV_GRID_SIZE = 10;

var NON_NAV_GRIDS = {};

function nToGridSize(n) {
  n = Math.floor(n / NAV_GRID_SIZE) * NAV_GRID_SIZE;
  return n;
}

function validPosition(x, y) {
  var key = getGridKey(x, y);
  var blocked = NON_NAV_GRIDS[key];
  return !blocked;
}

function createNavMesh(drawables) {
  for (var i = 0; i < drawables.length; i++) {
    var item = drawables[i];

    if (item.isStatic) {
      var maxx = item.x + item.image.width;
      var maxy = item.y + item.image.height;

      for (var x = item.x; x < maxx; x += NAV_GRID_SIZE) {
        for (var y = item.y; y < maxy; y += NAV_GRID_SIZE) {
          var navKey = getGridKey(x, y);
          NON_NAV_GRIDS[navKey] = true;
        }
      }
    }
  }
}

function getGridKey(x, y) {
  gridX = nToGridSize(x);
  gridY = nToGridSize(y);

  var navKey = "" + gridX + "," + gridY;
  return navKey;
}

function drawNavGrid(ctx) {
  ctx = ctx || document.getElementById("restworld").getContext("2d");

  for (var key in NON_NAV_GRIDS) {
    var x = Number(key.split(",")[0]);
    var y = Number(key.split(",")[1]);

    var xg = gameXToScreenX(x);
    var yg = gameYToScreenY(y);

    ctx.fillStyle = "rgba(255,0,0,.5)";
    ctx.fillRect(xg, yg, NAV_GRID_SIZE, NAV_GRID_SIZE);
  }
}

