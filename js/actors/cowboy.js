var COWBOY_START_X = 188
var COWBOY_START_Y = 4

var COWBOY;

class Cowboy extends Person {
  constructor(x, y, label) {
    super(x, y, label)
    this.x = COWBOY_START_X
    this.y = COWBOY_START_Y
    this.label = "cowboy"

    this.direction = EAST
    this.weapon = PISTOL
    this.horse = false
    this.shots = 0
    this.health = 10
    this.maxHealth = 10
    this.items = []
    this.special_actions = []
    this.isFollowingPath = false

    this.trace_path = this.trace_path.bind(this)
    this.step = this.step.bind(this)
    this.stop = this.stop.bind(this)
    this.takeDamage = this.takeDamage.bind(this)
    this.updateHealthUI = this.updateHealthUI.bind(this)
    this.die = this.die.bind(this)
    this.draw = this.draw.bind(this)

    this.updateHealthUI()
  }

  get image() {
    if (this.horse) {
      return IMAGES[["cowboy_horse_north", "cowboy_horse_east", "cowboy_horse_south", "cowboy_horse_west"][this.direction]];
    } else {
      return IMAGES[["cowboy_north", "cowboy_east", "cowboy_south", "cowboy_west"][this.direction]];
    }
  }

  trace_path() {
    if (this.isFollowingPath) {
      var point = this.special_actions.shift();
      if (point) {
        set_waypoint(this, point[0], point[1], true);
      } else {
        this.stop();
      }
    }
  }

  step() {
    if (this.horse) {
      return HORSE.step()
    } else {
      return 1;
    }
  }

  stop(route) {
    clear_intervals(this.actions);
    if (route) {
      this.trace_path();
    } else {
      this.actions = [];
      this.isFollowingPath = false;
    }
  }

  takeDamage(str) {
    playAudio('beer')

    this.health -= 1
    this.updateHealthUI()
    this.die()
  }

  updateHealthUI() {
    let bar = document.getElementById('health-bar')
    let level = document.getElementById('health-level')
    let current = document.getElementById('current-health')
    let max = document.getElementById('max-health')
    current.textContent = this.health
    max.textContent = this.maxHealth

    let percentage = 1 - (this.maxHealth - this.health) / this.maxHealth
    level.style.width = (200 * percentage) + 'px'
  }

  draw(ctx) {
    if (this.health <= 0) {
      return
    }
    if (this.special_actions.length > 0) {
      var p0 = this.special_actions[0];

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);

      for (var i = 0; i < this.special_actions.length; i++) {
        var p1 = this.special_actions[i];
        ctx.lineTo(p0[0], p0[1], p1[0], p1[1]);
        p0 = p1;
      }

      ctx.stroke();
    }
    draw_actor(ctx, this);
  }
}

function doneReloading() {
  console.log('done reloading')
  COWBOY.isReloading = false
}

function shoot(actor, drawables, angle) {
  var dx = REAL_MOUSE_X - window.innerWidth / 2
  var dy = REAL_MOUSE_Y - window.innerHeight / 2
  var angle = angle || Math.atan2(-dy, dx);

  var ff;
  if (actor.weapon == PISTOL) {
    ff = ["bullet_north", "bullet_east", "bullet_south", "bullet_west"];
    if (COWBOY.isReloading) {
      return
    }

    COWBOY.shots++
    if (COWBOY.shots % 7 === 0) {
      COWBOY.isReloading = true
      playAudio('reload');
      setTimeout(doneReloading, 900)
      return
    } else {
      playAudio('gunshot')
    }
  } else if (actor.weapon == SHOTGUN) {
    if (COWBOY.isReloading) {
      return
    }
    COWBOY.isReloading = true
    new ShotgunBlast(actor.x, actor.y, angle, dx, dy)
    playAudio('shotgun');
    setTimeout(doneReloading, 1200)
    return
  } else if (actor.weapon == TOMAHAWK) {
    ff = ["tomahawk_north", "tomahawk_east", "tomahawk_south", "tomahawk_west"];
  } else if (actor.weapon == ARROW) {
    ff = ["arrow_north", "arrow_east", "arrow_south", "arrow_west"];
  }

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

      for (var i = 0; i < KILLABLE.length; i++) {
        var thing = KILLABLE[i];
        if (thing.alive) {
          var dist = 5
          if (thing !== COWBOY &&
              Math.abs(this.x - thing.x) < 7 &&
              Math.abs(this.y - thing.y) < 7) {
            if (thing.die) {
              thing.die();
            } else if (thing.alive !== undefined) {
              thing.alive = false
            }
            this.hit = true;
          }
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
