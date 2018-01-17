class Person extends Drawable {
  constructor(x, y, label) {
    super(x, y, label)
    this.alive = true
    this.way_x = undefined
    this.way_y = undefined
    this.actions = []

    // make sure stop can be called from callbacks
    this.stop = this.stop.bind(this)
  }

  draw(ctx) {
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
}