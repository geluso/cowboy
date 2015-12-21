var HORSE;

function birth_horse(ctx, a) {
  HORSE = {
    image: function () {
      if (this.alive) {
        return IMAGES[["horse_north", "horse_east", "horse_south", "horse_west"][this.direction]];
      } else {
        return IMAGES["dead_horse"];
      }
    },
    x: 20 + 50,
    y: 20 + 50,
    way_x: undefined,
    way_y: undefined,
    actions: [],
    label: function() { return "horse"; },
    step: function() { return 2; },
    stop: function () {
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
    },
    draw: function (ctx) {
      if (this.way_x !== undefined && this.way_y !== undefined) {
          if (Math.abs(COWBOY.x - HORSE.x) < 10 &&
              Math.abs(COWBOY.y - HORSE.y) < 10) {
            HORSE.bridle();
          }
      }

      if (!this.alive) {
        ctx.drawImage(this.image(),
            this.frame_width * this.frame, 0, this.frame_width, this.frame_height,
            this.x - Math.floor(this.frame_width / 2),
            this.y - Math.floor(this.frame_height / 2),
            this.frame_width, this.frame_height);
      } else if (this.unbridled) {
        draw_actor(ctx, this);
      }
    },
    alive: true,
    unbridled: true,
    direction: EAST,
    // death animation
    frame_width: 17,
    frame_height: 12,
    frames: 7,
    frame: 0,
    delay: 2000,
    bridle: function() {
        COWBOY.horse = true;
        HORSE.unbridled = false;
        HORSE.x = COWBOY.x;
        HORSE.y = COWBOY.y;

        HORSE.way_x = undefined;
        HORSE.way_y = undefined;
    },
    unbridle: function() {
        COWBOY.horse = false;
        HORSE.unbridled = true;
        HORSE.x = COWBOY.x;
        HORSE.y = COWBOY.y;
    },
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
  a.push(HORSE);
}
