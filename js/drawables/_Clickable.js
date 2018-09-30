const CLICKABLES = [];

class Clickable extends Drawable {
  constructor(x, y, label) {
    super(x, y, label);
    CLICKABLES.push(this);
  }

  static processClicks(x, y) {
    let isClicked = false;
    CLICKABLES.forEach(clickable => {
      if (clickable.contains(x, y)) {
        isClicked = true;
        clickable.onClick(x, y);
      }
    });
    return isClicked;
  }

  contains(x, y) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= (this.x + this.image.width) &&
      y <= (this.y + this.image.height)
    );
  }

  onClick(xx, yy) {
    console.log('clicked noop', this);
  }
}
