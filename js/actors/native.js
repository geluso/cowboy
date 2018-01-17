class Native extends NPC {
  constructor(x, y, label) {
    super(x, y, "native")
    this.image = "native"
    this.inTent = false
    this.isAwake = false

    // make sure stop can be called from callbacks
    this.stop = this.stop.bind(this)

    this.wake()
  }

  draw(ctx) {
    if (!this.inTent) {
      super.draw(ctx)
    }
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

  walkFinished() {
    if (!this.destinationTent) {
      return;
    }
    let distFromTent = distance(this.x, this.y, this.destinationTent.x, this.destinationTent.y)
    if (distFromTent < 25) {
      this.destinationTent = undefined;
      this.goingToTent = false;
      this.inTent = true;
    }
  }

  chooseAction() {
    var delay = Math.random() * 10;
    var move = Math.random() * 10;

    if (this.inTent) {
      // small chance to exit tent
      let leaveTentRoll = Math.random()
      if (leaveTentRoll < .5) {
        this.inTent = false;
      } else {
        // try again after delay
        setTimeout(this.stop, delay * 1000);
        return
      }
    }

    // decide to go to tent
    if (move < 1) {
      this.goingToTent = true;
      if (Math.random() < .5) {
        this.destinationTent = TEPEE1;
      } else {
        this.destinationTent = TEPEE2;
      }
      set_waypoint(this, this.destinationTent.x, this.destinationTent.y);
      return
    }

    super.chooseAction()
  }
}
