class NPC extends Person {
  constructor(x, y, label) {
    super(x, y, label)
    this.isAwake = false

    // make sure stop can be called from callbacks
    this.stop = this.stop.bind(this)

    this.wake()
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

  stop() {
    super.stop()

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