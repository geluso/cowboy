class Haystack extends Drawable {
  constructor(x, y, label) {
    super(x, y, "haystack")
    this.x = x
    this.y = y
    this.image = Math.random() < .5 ? "haystack1" : "haystack2";
  }
}
