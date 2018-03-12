class Person extends Drawable {
  constructor(x, y, label) {
    super(x, y, label)
    this.alive = true
    this.way_x = undefined
    this.way_y = undefined
    this.actions = []
    this.health = 1

    // make sure stop can be called from callbacks
    this.stop = this.stop.bind(this)
  }

  draw(ctx) {
    if (!this.alive) {
      return
    }
    draw_actor(ctx, this);
  }

  step() {
    var step = .6;
    return step;
  }

  stop() {
    if (this.actions) {
      clear_intervals(this.actions);
    }
    this.actions = [];
    this.way_x = undefined;
    this.way_y = undefined;

    if (!this.alive) {
      return;
    }
    this.chooseAction()
  }

  die() {
    this.health--;
    if (this.health <= 0) {
      this.alive = false
      this.stop();
      let epitaph = `here lies ${this.label} R.I.P.`;
      (new Gravestone(this.x, this.y, epitaph)).build()

      if (this === COWBOY) {
        document.body.classList.remove('brighten')
        document.body.classList.add('gogray')
        lerpZoom(SCALE, .2, 3000)
      }
    }
  }
}
