class Item {
  constructor(x, y) {
    this.x = x
    this.y = y
    this.src = "bullet_west"
    this.label = "bullet"
  }

  get image() {
    return IMAGES[this.src]
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y)
  }

  collide(x, y) {
    // offset to be more centered on cowboy
    // instead of his top left corner
    let xOff = 4
    let yOff = 6
    if (distance(this.x, this.y, x + xOff, y + yOff) < 4) {
      COWBOY.items.push(this);
      let index = DRAWABLES.indexOf(this)
      DRAWABLES.splice(index, 1)
    }
  }
}

Item.randomItem = (x, y) => {
  let choice = choose([Bullet, Arrow, Tomahawk])
  return new choice(x, y)
}