var COWS = [];
var TOTAL_COWS = 23;
var COW_CENTER_X = -400;
var COW_CENTER_Y = 100;
var COW_RADIUS = 180;

var GATE = {
  x: -145,
  y: 370
};

function birthCows(ctx, a) {
  for (var i = 0; i < TOTAL_COWS; i++) {
    var x = COW_CENTER_X + Math.random() * COW_RADIUS;
    var y = COW_CENTER_Y + Math.random() * COW_RADIUS;
    cow = birthCow(x, y);
    a.push(cow);
    COWS.push(cow);
  }
}

function place_fence() {
  var leftmost = COW_CENTER_X - 75 + 10;
  var topmost = COW_CENTER_Y - 50;
  // top line
  for (var i = 0; i < 20; i++) {
    DRAWABLES.push({
      image: function () {
        return IMAGES["fence_north"];
      },
      x: leftmost + 24 * i,
      y: topmost,
      isStatic: true,
      label: function() { return "fence"; },
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }

  // west side
  for (var i = 0; i < 13; i++) {
    DRAWABLES.push({
      image: function () {
        return IMAGES["fence_west"];
      },
      x: leftmost - 8,
      y: 6 + topmost + 24 * i,
      isStatic: true,
      label: function() { return "fence"; },
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }

  // east side
  for (var i = 0; i < 13; i++) {
    if (i < 2 || i > 4) {
      DRAWABLES.push({
        image: function () {
          return IMAGES["fence_east"];
        },
        x: leftmost + 480,
        y: 6 + topmost + 24 * i,
        isStatic: true,
        label: function() { return "fence"; },
        draw: function (ctx) {
          ctx.drawImage(this.image(), this.x, this.y);
        }
      });
    }
  }

  // bottom line
  for (var i = 0; i < 20; i++) {
    DRAWABLES.push({
      image: function () {
        return IMAGES["fence_south"];
      },
      x: leftmost + 24 * i,
      y: topmost + 312,
      isStatic: true,
      label: function() { return "fence"; },
      draw: function (ctx) {
        ctx.drawImage(this.image(), this.x, this.y);
      }
    });
  }

}

function birthCow(x, y) {
  var cow;
  cow = {
    image: function () {
      if (this.alive) {
        return IMAGES[["cow_north", "cow_east", "cow_south", "cow_west_branded"][this.direction]];
      } else {
        return IMAGES["dead_cow"];
      }
    },
    x: x,
    y: y,
    way_x: undefined,
    way_y: undefined,
    actions: [],

    behavior: 'wander',

    // steering
    mass: 50,
    MaxSpeed: 2,
    MaxForce: 2,
    MaxTurnRate: undefined,

    VehicleHeading: randomUnitVector(),
    //VehicleSide: {x: 0, y: -1},

    // wandering
    WanderRadius: 2,
    WanderDistance: 5,
    WanderJitter: 1,
    WanderTarget: {
      x: 0,
      y: 0
    },

    velocity: {
      x: 0,
      y: 0
    },

    way_attempts: 0,
    lastX: undefined,
    lastY: undefined,
    targetLocation: function() {
      // have target in mind?
      if (this.way_x && this.way_y) {
        if (Math.abs(this.lastX - this.x) < 2 &&
            Math.abs(this.lastY - this.y) < 2) {
          this.way_attempts++;
        }

        this.lastX = this.x;
        this.lastY = this.y;

        if (this.way_attempts > 100) {
          this.way_attempts = 0;
          this.way_x = 0;
          this.way_y = 0;
        }

        if (this.x === this.way_x && this.y === this.way_y) {
          this.behavior = 'wander';
        }
      } else {
        if (Math.random() < .1) {
          this.way_x = HORSE.x;
          this.way_y = HORSE.y;
        } else {
          this.way_x = Math.round(this.x + 100 * randomNegPos());
          this.way_y = Math.round(this.y + 100 * randomNegPos());
        }
      }

      var loc = {
        x: this.way_x,
        y: this.way_y
      }

      return loc;
    },

    flee: function() {
      var fx = this.x - COWBOY.x;
      var fy = this.y - COWBOY.y;

      var desiredVelocity = unitVector(fx, fy);

      desiredVelocity.x *= this.MaxSpeed;
      desiredVelocity.y *= this.MaxSpeed;

      var steeringX = desiredVelocity.x - this.velocity.x;
      var steeringY = desiredVelocity.y - this.velocity.y;

      var steering = {
        x: steeringX,
        y: steeringY,
      }

      return steering;
    },

    seek: function() {
      var loc = this.targetLocation();

      var fx = loc.x - this.x;
      var fy = loc.y - this.y;

      var desiredVelocity = unitVector(fx, fy);

      desiredVelocity.x *= this.MaxSpeed;
      desiredVelocity.y *= this.MaxSpeed;

      var steeringX = desiredVelocity.x - this.velocity.x;
      var steeringY = desiredVelocity.y - this.velocity.y;

      var steering = {
        x: steeringX,
        y: steeringY,
      }

      return steering;
    },

    wander: function() {
      var jitterX = this.WanderTarget.x + this.WanderJitter * randomNegPos();
      var jitterY = this.WanderTarget.y + this.WanderJitter * randomNegPos();

      var target = unitVector(jitterX, jitterY);
      target = scaleVector(target, this.WanderRadius);

      var distance = scaleVector(this.VehicleHeading, this.WanderDistance);

      target = vectorAdd(target, distance);
      return target;
    },

    steer: function() {
      var steer;
      if (vectorDistance(COWBOY, this) < 150) {
        steer = this.flee();
      } else if (this.behavior === 'seek') {
        steer = this.seek();
      } else {
        steer = this.wander();
      }
      return steer;
    },

    update: function() {
      // dead cows don't move.
      if (!this.alive) {
        return;
      }

      var steer = this.steer();

      if (!steer) {
        return
      }

      // restrict it if it's too much force
      steer = capVector(steer, this.MaxForce);

      steer.x = steer.x / this.mass;
      steer.y = steer.y / this.mass;

      this.velocity.x += steer.x;
      this.velocity.y += steer.y;

      this.velocity = capVector(this.velocity, this.MaxSpeed);

      this.x += this.velocity.x / 2;
      this.y += this.velocity.y / 2;

      this.x = this.x;
      this.y = this.y;

      if (this.x > -460 && this.x < 0 &&
          this.y > 60 && this.y < 350) {
        if (this.x < -450) {
          this.behavior = 'seek';
          this.x = -450;
          this.velocity.x *= -1;
        }

        if (this.x > -10) {
          if (this.y > 100 && this.y < 175) {
            return;
          } else {
            this.behavior = 'seek';
            this.x = -10;
            this.velocity.x *= -1;
          }
        }

        if (this.y < 70) {
          this.behavior = 'seek';
          this.y = 70;
          this.velocity.y *= -1;
        }

        if (this.y > 340) {
          this.behavior = 'seek';
          this.y = 340;
          this.velocity.y *= -1;
        }
      }

      if (vectorLength > .0001) {
        VehicleHeading = unitVectorFromVector(this.velocity);
      }
    },

    label: function() { return "cow"; },
    step: function() {
      var step = .6;
      return step;
    },
    stop: function () {
      return;

      if (cow.actions) {
        clear_intervals(cow.actions);
      }
      cow.actions = [];
      cow.way_x = undefined;
      cow.way_y = undefined;

      if (!cow.alive) {
        return;
      }

      var delay = Math.random() * 10;
      var move = Math.random() * 10;
      if (move < 6) {
        // don't always pick a destination
        setTimeout(cow.stop, delay * 1000);
      } else {
        var x, y;
        if (Math.random() > .5) {
          x = cow.x + Math.random() * 100;
        } else {
          x = cow.x - Math.random() * 100;
        }

        if (Math.random() > .5) {
          y = cow.y + Math.random() * 100;
        } else {
          y = cow.y - Math.random() * 100;
        }

        set_waypoint(cow, x, y);
      }
    },
    draw: function (ctx) {

      this.update();

      if (!this.alive) {
        ctx.drawImage(this.image(),
            this.frame_width * this.frame, 0, this.frame_width, this.frame_height,
            this.x - Math.floor(this.frame_width / 2),
            this.y - Math.floor(this.frame_height / 2),
            this.frame_width, this.frame_height);
      } else {
        draw_actor(ctx, this);
      }

      return;

      if (COW_BRAIN) {
        if (this.way_x && this.way_y) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.way_x, this.way_y);
          ctx.stroke();
        }
      }
    },
    alive: true,
    direction: EAST,
    // death animation
    frame_width: 17,
    frame_height: 12,
    frames: 7,
    frame: 0,
    delay: 2000,
    kill: function() {
      if (this.alive) {
        this.alive = false;
        this.decay(this);
      }
    },
    decay: function (actor) {
      actor.frame++;
      if (actor.frame < actor.frames) {
        setTimeout(function() {
          actor.decay(actor);
        }, actor.delay);
      }
    }
  }
  cow.stop();

  return cow;
}

