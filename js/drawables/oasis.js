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
    const fishX = COWBOY.x + Math.random() * 60;
    const fishY = COWBOY.y + Math.random() * 60;
    DRAWABLES.push(new Fish(fishX, fishY));
  }
}
