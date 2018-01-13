class Native extends Person {
  constructor(x, y, label) {
    super(x, y, "native")
    this.image = "native"
    this.inTent = false

    // make sure stop can be called from callbacks
    this.stop = this.stop.bind(this)

    // stop activates their movement
    this.stop()
  }

  draw(ctx) {
    if (!this.inTent) {
      super.draw(ctx)
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

  stop() {
    super.stop()
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
    } else if (move < 6) {
      // don't always pick a destination
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
