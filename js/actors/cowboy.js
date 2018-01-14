var COWBOY_START_X = 188
var COWBOY_START_Y = 4

var COWBOY;

function birth_cowboy(ctx, a) {
  COWBOY = {
    get image() {
      if (this.horse) {
        return IMAGES[["cowboy_horse_north", "cowboy_horse_east", "cowboy_horse_south", "cowboy_horse_west"][this.direction]];
      } else {
        return IMAGES[["cowboy_north", "cowboy_east", "cowboy_south", "cowboy_west"][this.direction]];
      }
    },
    health: 10,
    x: COWBOY_START_X,
    y: COWBOY_START_Y,
    way_x: undefined,
    way_y: undefined,
    items: [],
    actions: [],
    special_actions: [],
    isFollowingPath: false,
    trace_path: function() {
      if (this.isFollowingPath) {
        var point = this.special_actions.shift();
        if (point) {
          set_waypoint(COWBOY, point[0], point[1], true);
        } else {
          this.stop();
        }
      }
    },
    step: function () {
      if (this.horse) {
        return HORSE.step()
      } else {
        return 1;
      }
    },
    stop: function (route) {
      clear_intervals(this.actions);
      if (route) {
        COWBOY.trace_path();
      } else {
        this.actions = [];
        this.isFollowingPath = false;
      }
    },
    horse: false,
    get label() {
      if (this.horse) {
        return "cowbzeroy on horse";
      } else {
        return "cowbzeroy";
      }
    },
    draw: function (ctx) {
      if (this.health <= 0) {
        return
      }
      if (this.special_actions.length > 0) {
        var p0 = this.special_actions[0];

        ctx.beginPath();
        ctx.moveTo(COWBOY.x, COWBOY.y);

        for (var i = 0; i < this.special_actions.length; i++) {
          var p1 = this.special_actions[i];
          ctx.lineTo(p0[0], p0[1], p1[0], p1[1]);
          p0 = p1;
        }

        ctx.stroke();
      }
      draw_actor(ctx, this);
    },
    direction: EAST,
    weapon: PISTOL,
  }
  a.push(COWBOY);
}

function shoot(actor, drawables, angle) {
  var ff;
  if (actor.weapon == PISTOL) {
    ff = ["bullet_north", "bullet_east", "bullet_south", "bullet_west"];
  } else if (actor.weapon == TOMAHAWK) {
    ff = ["tomahawk_north", "tomahawk_east", "tomahawk_south", "tomahawk_west"];
  } else if (actor.weapon == ARROW) {
    ff = ["arrow_north", "arrow_east", "arrow_south", "arrow_west"];
  }

  var dx = REAL_MOUSE_X - window.innerWidth / 2
  var dy = REAL_MOUSE_Y - window.innerHeight / 2
  var angle = angle || Math.atan2(-dy, dx);

  var projectile = {
    x: actor.x,
    y: actor.y - 10,
    angle: angle,
    get image() {
      this.tick++;
      if (this.type == TOMAHAWK) {
        if (this.tick % 8 == 0) {
          this.direction = (this.direction + 1) % 4;
        }
      }
      return IMAGES[ff[this.direction]];
    },
    draw: function (ctx) {
      if(this.hit) {
        return;
      }

      this.x += this.speed * Math.cos(this.angle);
      this.y += -this.speed * Math.sin(this.angle);
      ctx.drawImage(this.image, this.x, this.y);
      if (HORSE.alive && HORSE.unbridled &&
            Math.abs(this.x - HORSE.x) < 7 &&
            Math.abs(this.y - HORSE.y) < 7) {
        HORSE.kill();
        this.hit = true;
      }

      for (var i = 0; i < COWS.length; i++) {
        var cow = COWS[i];
        if (cow.alive &&
            Math.abs(this.x - cow.x) < 7 &&
            Math.abs(this.y - cow.y) < 7) {
          cow.kill();
          this.hit = true;
        }
      }
      for (var i = 0; i < CROWS.length; i++) {
        var crow = CROWS[i];
        if (crow.alive &&
            Math.abs(this.x - crow.x) < 3 &&
            Math.abs(this.y - crow.y) < 3) {
          crow.kill();
          this.hit = true;
        }
      }
    },
    speed: actor.weapon == PISTOL ? 12 : 6,
    type: actor.weapon,
    tick: 0,
    timer: 100,
    direction: angleToDirection(angle),
  }
  drawables.push(projectile);
}
