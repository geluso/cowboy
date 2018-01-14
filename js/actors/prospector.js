class Prospector extends Person {
  constructor(x, y, label) {
    super(x, y, "prospector");
    this.image = "prospector";
    this.x = x || -100;
    this.y = y || -100;
  }
}
