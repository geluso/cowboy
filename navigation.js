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
      var maxx = item.x + item.image().width;
      var maxy = item.y + item.image().height;

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

  var x = x || COWBOY.x;
  var y = y || COWBOY.y;

  var x0 = Math.round(x - WIDTH / 2);
  var x1 = Math.round(x + WIDTH / 2);
  x0 = nToGridSize(x0);
  x1 = nToGridSize(x1);

  var y0 = Math.round(y - HEIGHT / 2);
  var y1 = Math.round(y + HEIGHT / 2);
  y0 = nToGridSize(y0);
  y1 = nToGridSize(y1);

  for (var x = x0; x < x1; x+= NAV_GRID_SIZE) {
    for (var y = y0; y < y1; y += NAV_GRID_SIZE) {
      var key = getGridKey(x, y);
      var grid = NON_NAV_GRIDS[key];

      if (grid) {
        // red
        fill = "rgba(255,0,0,.5)";
      } else {
        // green
        fill = "rgba(0,255,0,.5)";
      }

      var xg = gameXToScreenX(x);
      var yg = gameYToScreenY(y);

      ctx.fillStyle= fill;
      ctx.fillRect(xg, yg, NAV_GRID_SIZE, NAV_GRID_SIZE);
    }
  }
}

