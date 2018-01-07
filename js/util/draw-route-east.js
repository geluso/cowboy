function drawRouteEast(ctx) {
  let x = gameXToScreenX(329)
  let y = gameYToScreenY(194)
  let width = window.innerWidth * 99
  let height = 15
  ctx.save()
  ctx.fillStyle = 'brown'
  ctx.fillRect(x, y, width, height);
  ctx.restore()
}