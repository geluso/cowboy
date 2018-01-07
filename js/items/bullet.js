class Bullet {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  get label() {
    return "bullet"
  }

  get image() {
    return IMAGES["bullet_west"]
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y)
  }

  collide(x, y) {
    if (distance(this.x, this.y, x, y) < 4) {
      COWBOY.items.push(this);
      let index = DRAWABLES.indexOf(this)
      DRAWABLES.splice(index, 1)
    }
  }
}