function drawRouteEast(ctx) {
  let xx = 329
  let yy = 194
  let x = gameXToScreenX(xx)
  let y = gameYToScreenY(yy)
  let width = window.innerWidth
  let height = 15
  ctx.save()
  ctx.fillStyle = '#d6d68f'
  // fill whole width
  if (COWBOY.x > (window.innerWidth / 2) + xx) {
    ctx.fillRect(0, y, width, height);
  } else {
    ctx.fillRect(x, y, width, height);
  }
  ctx.restore()
}