class Sign extends Drawable {
  constructor(x, y, label) {
    super(x, y, label)
    this.image = "signpost_tall";
    this.x = x;
    this.y = y;
    this.label = label;
  }
}