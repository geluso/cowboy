class Gravestone extends Drawable {
  constructor(x, y, label) {
    super(x, y, label)
    let gravestones = [
      "grave1",
      "grave2",
      "grave3",
      "grave4",
      "grave5",
      "grave6",
      "grave7",
    ]
    this.image = choose(gravestones)
  }
}