var REAL_MOUSE_X = 0,
    REAL_MOUSE_Y = 0;
var MOUSE_X = 0,
    MOUSE_Y = 0;

$(document).ready(function() {
  $("#stack").mousemove(mousemove);
  $("#stack").mousedown(mousedown);
  $("#stack").mouseup(mouseup);
  $("#stack").click(click);
});

var MOUSEDOWN = false;
var STACK_WAYPOINTS = [];
var traceCourseTimer = undefined;
var TRACE_COURSE = false;
var LAST_MOUSEUP;

var RANDOM;
function mousedown(e) {
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
  STACK_WAYPOINTS = [];
  STACK_WAYPOINTS.push([MOUSE_X, MOUSE_Y]);
  TRACE_COURSE = true;
}
  
function mousemove(e) {
  REAL_MOUSE_X = e.offsetX;
  REAL_MOUSE_Y = e.offsetY;

  MOUSE_X = e.offsetX - TRANSLATE_X;
  MOUSE_Y = e.offsetY - TRANSLATE_Y;

  if (TRACE_COURSE) {
    STACK_WAYPOINTS.push([MOUSE_X, MOUSE_Y]);
  }
};


function mouseup(e) {
  MOUSEDOWN = false;
  if (TRACE_COURSE) {
    LAST_MOUSEUP = (new Date()).getTime();

    var point = STACK_WAYPOINTS.shift();
    COWBOY.special_actions = STACK_WAYPOINTS;
    COWBOY.trace_path();
  }

  TRACE_COURSE = false;
}

function click(e) {
  // prevent clicks from counting immediately after recording routes.
  var now = (new Date()).getTime();
  if (now - LAST_MOUSEUP < 500) {
    return;
  }

  set_waypoint(COWBOY, MOUSE_X, MOUSE_Y);
}
