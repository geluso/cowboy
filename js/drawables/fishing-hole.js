class TinyFishingHole extends Clickable {
  constructor(xx, yy, label) {
    super(xx, yy, "tiny fishing hole")
    this.image = "fishing-hole-tiny"
  }
}

class FishingHole extends Clickable {
  constructor(xx, yy, label) {
    super(xx, yy, "fishing hole")
    this.image = "fishing-hole-large"
  }

  onClick(xx, yy) {
    const fishX = COWBOY.x + Math.random() * 60;
    const fishY = COWBOY.y + Math.random() * 60;
    DRAWABLES.push(new Fish(fishX, fishY));
  }
}
