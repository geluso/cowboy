class SmallOasis extends Drawable {
  constructor(x, y, label) {
    super(x, y, "tiny oasis")
    this.x = x
    this.y = y
    this.image = "oasis-tiny"
  }
}

class LargeOasis extends Drawable {
  constructor(x, y, label) {
    super(x, y, "oasis")
    this.x = x
    this.y = y
    this.image = "oasis-large"
  }
}