var DOWN_X, DOWN_Y, UP_X, UP_Y;
var COWBOY_DOWN_X, COWBOY_DOWN_Y;
var REAL_MOUSE_X = 0,
    REAL_MOUSE_Y = 0;
var MOUSE_X = 0,
    MOUSE_Y = 0;

$(document).ready(function() {
  $("#stack").mousemove(mousemove);
  $("#stack").mousedown(mousedown);
  $("#stack").mouseup(ev => {
    // only do click if mouseup didn't resolve on a clickable target
    if (!mouseup(ev)) {
      click(ev);
    }
  });
  $(document).mouseout(mouseup);
  //$("#stack").click(click);
});

var MOUSEDOWN = false;
var traceCourseTimer = undefined;
var TRACE_COURSE = false;
var LAST_MOUSEUP;

var RANDOM;
function mousedown(e) {
  DOWN_X = e.offsetX;
  DOWN_Y = e.offsetY;

  // first click disables help screen
  if (DRAW_HELP_TEXT) {
    DRAW_HELP_TEXT = !DRAW_HELP_TEXT;
    return;
  }

  if (COWBOY.special_actions.length === 0) {
    COWBOY_DOWN_X = COWBOY.x;
    COWBOY_DOWN_Y = COWBOY.y;
  } else {
    COWBOY_DOWN_X = COWBOY.special_actions[COWBOY.special_actions.length - 1][0];
    COWBOY_DOWN_Y = COWBOY.special_actions[COWBOY.special_actions.length - 1][1];
  }

  MOUSEDOWN = true;
  var random = Math.random();
  RANDOM = random;
  var traceCourseTimer = setTimeout(function() {
    if (MOUSEDOWN && RANDOM === random) {
      traceCourse();
    }
  }, 100);
}

function traceCourse() {
  TRACE_COURSE = true;

  var xx = (REAL_MOUSE_X - DOWN_X) + COWBOY_DOWN_X;
  var yy = (REAL_MOUSE_Y - DOWN_Y) + COWBOY_DOWN_Y;

  if (COWBOY.special_actions.length === 0) {
    xx = COWBOY.x;
    yy = COWBOY.y;
  }

  // Why do I have to push this twice??
  COWBOY.special_actions.push([xx, yy]);
}

function mousemove(e) {
  REAL_MOUSE_X = e.offsetX;
  REAL_MOUSE_Y = e.offsetY;

  MOUSE_X = (e.offsetX / ORIGINAL_WIDTH) * SCALE_WIDTH - TRANSLATE_X;
  MOUSE_Y = (e.offsetY / ORIGINAL_HEIGHT) * SCALE_HEIGHT - TRANSLATE_Y;

  if (TRACE_COURSE) {
    traceCourse();
  }
};


function mouseup(e) {
  UP_X = e.offsetX;
  UP_Y = e.offsetY;

  MOUSEDOWN = false;

  // don't set a course if someone reacted to a click.
  if (Clickable.processClicks(MOUSE_X, MOUSE_Y)) {
    TRACE_COURSE = false;
    return true;
  }

  if (TRACE_COURSE) {
    LAST_MOUSEUP = (new Date()).getTime();

    COWBOY.isFollowingPath = true;
    COWBOY.trace_path();
  }

  TRACE_COURSE = false;
}

function click(e) {
  var sameClick = UP_X === DOWN_X && UP_Y === DOWN_Y;
  if (!sameClick) {
    // prevent clicks from counting immediately after recording routes.
    var now = (new Date()).getTime();
    if (now - LAST_MOUSEUP < 500) {
      return;
    }
  }

  // reset any special path actions if the cowboy currently has any.
  COWBOY.special_actions = [];

  var cowboyOffset = COWBOY.image.height / 2 - 1;
  set_waypoint(COWBOY, MOUSE_X, MOUSE_Y - cowboyOffset);
}
