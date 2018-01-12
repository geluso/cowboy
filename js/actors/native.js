function birth_native_dude(ctx, a, x, y) {
  var nativedude = {
    alive: true,
    get image() {
      return IMAGES["native"]; 
    },
    x: x,
    y: y,
    get label() { return "native"; },
    draw: function (ctx) {
      if (nativedude.inTent) {
        return;
      }
      draw_actor(ctx, this);
    },
    way_x: undefined,
    way_y: undefined,
    actions: [],
    step: function() {
      var step = .6;
      return step;
    },
    stop: function () {
      if (nativedude.actions) {
        clear_intervals(nativedude.actions);
      }
      nativedude.actions = [];
      nativedude.way_x = undefined;
      nativedude.way_y = undefined;

      if (!nativedude.alive) {
        return;
      }

      var delay = Math.random() * 10;
      var move = Math.random() * 10;

      if (nativedude.inTent) {
        // 50/50 chance to leave tent
        if (Math.random() < .5) {
          nativedude.inTent = false;
        }
      }

      // decide to go to tent
      if (move < .9) {
        nativedude.goingToTent = true;
        if (Math.random() < .5) {
          nativedude.destinationTent = TEPEE1;
        } else {
          nativedude.destinationTent = TEPEE2;
        }
        set_waypoint(nativedude, nativedude.destinationTent.x, nativedude.destinationTent.y);
      } else if (move < 6) {
        // don't always pick a destination
        setTimeout(nativedude.stop, delay * 1000);
      } else {
        var x = 360;
        var y = 310;
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

        set_waypoint(nativedude, x, y);
      }
    },
    walkFinished: function() {
      if (!nativedude.destinationTent) {
        return;
      }
      if (nativedude.x === nativedude.destinationTent.x && 
          nativedude.y === nativedude.destinationTent.y) {
        nativedude.destinationTent = undefined;
        nativedude.goingToTent = false;
        nativedude.inTent = true;
      }
    }
  };
  nativedude.stop();
  a.push(nativedude);
  return nativedude;
}
