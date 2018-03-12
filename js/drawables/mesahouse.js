class MesaHouse extends Drawable {
  constructor(x, y, label) {
    super(x, y, "Mesa House")
    this.x = x
    this.y = y
    this.static = true;
    this.image = "mesahouse1"
    this.build()
  }
}

class MesaTown {
  static createMesaTown(x, y) {
    let numHousesTopRow = 4 + Math.random() * 5;
    let numHousesBottomRow = 3 + Math.random() * 5;

    let xOff = 100;
    let yOff = 120;

    let houses = [];
    for (let i = 0; i < numHousesTopRow; i++) {
      houses.push(new MesaHouse(x + i * xOff, y));
    }
    for (let i = 0; i < numHousesBottomRow; i++) {
      let xx = x + i * xOff + xOff / 2;
      let yy = y + yOff;
      houses.push(new MesaHouse(xx, yy));
    }
    return houses;
  }
}