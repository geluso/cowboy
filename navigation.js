var NAV_GRID_SIZE = 16;

function drawNavGrid(ctx) {
  ctx.strokeStyle = "black";

  var x = x || COWBOY.x;
  var y = y || COWBOY.y;

  var x0 = Math.round(x - WIDTH / 2);
  var x1 = Math.round(x + WIDTH / 2);

  var y0 = Math.round(y - HEIGHT / 2);
  var y1 = Math.round(y + HEIGHT / 2);

  for (var x = x0; x < x1; x+= NAV_GRID_SIZE) {
    for (var y = y0; y < y1; y += NAV_GRID_SIZE) {
      var fill;
      if (x % 7 === 0) {
        fill = "rgba(255,0,0,.5)";
      } else {
        fill = "rgba(0,255,0,.5)";
      }

      var xg = gameXToScreenX(x);
      var yg = gameYToScreenY(y);

      ctx.fillStyle= fill;
      ctx.fillRect(xg, yg, NAV_GRID_SIZE, NAV_GRID_SIZE);
    }
  }
}
