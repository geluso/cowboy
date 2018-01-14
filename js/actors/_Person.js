class Person extends Drawable {
  constructor(x, y, label) {
    super(x, y, label)
    this.alive = true
    this.way_x = undefined
    this.way_y = undefined
    this.actions = []
    this.isAwake = false

    // make sure stop can be called from callbacks
    this.stop = this.stop.bind(this)

    this.wake()
  }

  draw(ctx) {
    draw_actor(ctx, this);
  }

  wake() {
    if (!this.isAwake) {
      this.isAwake = true
      this.chooseAction()
    }
  }

  sleep() {
    if (this.isAwake) {
      this.isAwake = false
      this.stop()
    }
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

  chooseAction() {
    var delay = Math.random() * 10;
    var roll = Math.random();

    if (roll < .4) {
      // just stay in plcae
      setTimeout(this.stop, delay * 1000);
    } else {
      var x = this.x;
      var y = this.y;
      var spread = 75;

      if (Math.random() > .5) {
        x = x + Math.random() * spread;
      } else {
        x = x - Math.random() * spread;
      }

      if (Math.random() > .5) {
        y = y + Math.random() * spread;
      } else {
        y = y - Math.random() * spread;
      }

      set_waypoint(this, x, y);
    }
  }
}