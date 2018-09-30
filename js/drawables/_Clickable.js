const CLICKABLES = [];
let CLICK_FOCUS = null;

class Clickable extends Drawable {
  constructor(x, y, label) {
    super(x, y, label);
    CLICKABLES.push(this);
  }

  static down() {
    let clicked = Clickable.getClickable();
    if (clicked) { 
      CLICK_FOCUS = clicked;
      CLICK_FOCUS.onDown();
    }
    return !!clicked;
  }

  static move() {
    if (CLICK_FOCUS) {
      CLICK_FOCUS.onMove();
      return true;
    }
  }

  static up(x, y) {
    let clicked = Clickable.getClickable();

    // only trigger once if they're the same thing
    if (clicked && clicked !== CLICK_FOCUS) {
      clicked.onUp();
      CLICK_FOCUS = null;
      return true;
    } else if (CLICK_FOCUS) {
      CLICK_FOCUS.onUp();
      CLICK_FOCUS = null;
      return true;
    }

    return false;
  }

  static getClickable(x, y) {
    x = x || MOUSE_X;
    y = y || MOUSE_Y;

    for (let i = 0; i < CLICKABLES.length; i++) {
      let clickable = CLICKABLES[i];
      if (clickable.contains(x, y)) {
        return clickable;
      }
    }
    return null;
  }

  contains(x, y) {
    return (
      x >= this.x &&
      y >= this.y &&
      x <= (this.x + this.image.width) &&
      y <= (this.y + this.image.height)
    );
  }

  onDown(xx, yy) {
    console.log('down click noop', this);
  }
  onMove(xx, yy) {
    console.log('move click noop', this);
  }
  onUp(xx, yy) {
    console.log('up click noop', this);
  }
}
