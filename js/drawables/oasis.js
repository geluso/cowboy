class SmallOasis extends Drawable {
  constructor(x, y, label) {
    super(x, y, "tiny oasis")
    this.x = x || 9500
    this.y = y || 9500
    this.image = "oasis-tiny"
  }
}

class LargeOasis extends Drawable {
  constructor(x, y, label) {
    super(x, y, "oasis")
    this.x = x || 10000
    this.y = y || 10000
    this.image = "oasis-large"
  }
}