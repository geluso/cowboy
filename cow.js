var COWS = [];
var COW_CENTER_X = -400;
var COW_CENTER_Y = 100;
var COW_RADIUS = 180;

var GATE = {
  x: -145,
  y: 370
};

function birth_cows(ctx, a) {
  var total = 23;

  var x = -3;
  var y = 20 + 50;
  var cow = birth_cow(ctx, a, x, y);
  COWS.push(cow);

  for (var i = 0; i < total; i++) {
    var x = COW_CENTER_X + Math.random() * COW_RADIUS;
    var y = COW_CENTER_Y + Math.random() * COW_RADIUS;
    cow = birth_cow(ctx, a, x, y);
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

  // west side
  for (var i = 0; i < 13; i++) {
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

  // bottom line
  for (var i = 0; i < 20; i++) {
    if (i < 12 || i > 14) {
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

}

function birth_cow(ctx, a, x, y) {
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

    // wander steering
    mass: 100,
    MaxSpeed: 5,
    MaxForce: undefined,
    MaxTurnRate: undefined,

    velocity: {
      x: 0,
      y: 0
    },

    targetLocation: function() {
      // have target in mind?
      if (this.way_x && this.way_y) {
        // on target?
        if (this.x === this.way_x && this.y === this.way_y) {
          // slim chance that we pick new target once arriving at current target.
          if (Math.random() < .001) {
            this.way_x = this.x + 100 * Math.random();
            this.way_y = this.y + 100 * Math.random();
          }
        }
      } else {
        if (Math.random() < .1) {
          this.way_x = GATE.x;
          this.way_y = GATE.y;
        } else {
          this.way_x = this.x + 100 * Math.random();
          this.way_y = this.y + 100 * Math.random();
        }
      }

      var loc = {
        x: this.way_x,
        y: this.way_y
      }

      return loc;
    },

    steer: function() {
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

    update: function() {
      var steer = this.steer();
      steer.x = steer.x / this.mass;
      steer.y = steer.y / this.mass;

      this.velocity.x += steer.x;
      this.velocity.y += steer.y;

      this.x += this.velocity.x;
      this.y += this.velocity.y;

      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
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
  a.push(cow);

  return cow;
}

