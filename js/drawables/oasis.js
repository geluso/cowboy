class SmallOasis extends Clickable {
  constructor(xx, yy, label) {
    super(xx, yy, "tiny oasis")
    this.image = "oasis-tiny"
  }
}

class LargeOasis extends Clickable {
  constructor(xx, yy, label) {
    super(xx, yy, "oasis")
    this.image = "oasis-large"
  }

  onClick(xx, yy) {
    console.log('large oasis', this);
  }
}
