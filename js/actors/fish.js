class Fish extends Clickable {
  constructor(xx, yy) {
    super(xx, yy, "fish");
    // num fish in array: 5
    // plus one "giant fish"
    if (Math.random() < .05) {
      this.isGiant = true;
      this.type = -1;
      this.label = "reel big fish";
    } else {
      this.isGiant = false;
      this.type = Math.floor(Math.random() * Fish.types().length);

      const labels = ["tiny fish", "small fish", "big fish", "fish", "fish"]
      this.label = labels[this.type]
    }
  }

  static types() {
    const dimensions = [
      {x:  0, y: 0, width: 1, height: 1},
      {x:  2, y: 0, width: 2, height: 2},
      {x:  5, y: 0, width: 6, height: 3},
      {x: 12, y: 0, width: 5, height: 2},
      {x: 18, y: 0, width: 3, height: 2}
    ];
    return dimensions;
  }

  get image() {
    if (this.isGiant) {
      return IMAGES["fish-giant"];
    } else {
      return IMAGES["fish-array"];
    }
  }

  draw(ctx) {
    if (this.isGiant) {
      return super.draw(ctx)
    }

    const dimens = Fish.types()[this.type];
    let sx = dimens.x
    let sy = dimens.y
    let sWidth = dimens.width
    let sHeight = dimens.height

    let dx = this.x
    let dy = this.y
    let dWidth = dimens.width;
    let dHeight = dimens.height;

    ctx.drawImage(this.image,
      sx, sy, sWidth, sHeight,
      dx, dy, dWidth, dHeight);
  }

  onUp(xx, yy) {
    const index = DRAWABLES.indexOf(this);
    DRAWABLES.splice(index, 1);
  }
}
