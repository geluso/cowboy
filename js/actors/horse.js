var HORSE;

function birth_horse(ctx, a) {
  HORSE = new Horse();
  a.push(HORSE);
}

class Horse extends Drawable {
  constructor(x, y) {
    super(x, y, "horse");
    this.x = 20 + 50
    this.y = 20 + 50
    this.way_x = undefined
    this.way_y = undefined
    this.actions = []
    this.label = "horse"

    this.alive = true
    this.unbridled = true
    this.direction = EAST
    this.frame_width = 17
    this.frame_height = 12
    this.frames = 7
    this.frame = 0
    this.delay = 2000
  }

  get image() {
    if (this.alive) {
      return IMAGES[["horse_north", "horse_east", "horse_south", "horse_west"][this.direction]];
    } else {
      return IMAGES["dead_horse"];
    }
  }

  step() {
    return 3;
  }

  stop() {
    clear_intervals(this.actions);
    this.actions = [];
    this.way_x = undefined;
    this.way_y = undefined;

    // if the cowboy is still far away then set a new waypoint toward him.
    if (Math.abs(COWBOY.x - HORSE.x) > 1 ||
        Math.abs(COWBOY.y - HORSE.y) > 1) {
      set_waypoint(HORSE, COWBOY.x, COWBOY.y);
    } else {
      HORSE.bridle();
    }
  }

  draw(ctx) {
    if (this.way_x !== undefined && this.way_y !== undefined) {
        if (Math.abs(COWBOY.x - HORSE.x) < 10 &&
            Math.abs(COWBOY.y - HORSE.y) < 10) {
          HORSE.bridle();
        }
    }

    if (!this.alive) {
      ctx.drawImage(this.image,
          this.frame_width * this.frame, 0, this.frame_width, this.frame_height,
          this.x - Math.floor(this.frame_width / 2),
          this.y - Math.floor(this.frame_height / 2),
          this.frame_width, this.frame_height);
    } else if (this.unbridled) {
      draw_actor(ctx, this);
    }
  }

  bridle() {
      COWBOY.horse = true;
      HORSE.unbridled = false;
      HORSE.x = COWBOY.x;
      HORSE.y = COWBOY.y;

      HORSE.way_x = undefined;
      HORSE.way_y = undefined;
  }

  unbridle() {
      COWBOY.horse = false;
      HORSE.unbridled = true;
      HORSE.x = COWBOY.x;
      HORSE.y = COWBOY.y;
  }

  kill() {
    if (this.alive) {
      this.alive = false;
      this.decay(this);
    }
  }

  decay(actor) {
    actor.frame++;
    if (actor.frame < actor.frames) {
      setTimeout(function() {
        actor.decay(actor);
      }, actor.delay);
    }
  }
}
