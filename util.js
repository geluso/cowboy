function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function actor_distance(a1, a2) {
  return distance(a1.x, a1.y, a2.x, a2.y);
}

function angleToDirection(angle) {
  var direction;

  if (-Math.PI / 4 < angle && angle < Math.PI / 4) {
    direction = 1;
  } else if (Math.PI / 4 < angle && angle < 3 * Math.PI / 4) {
    direction = 2;
  } else if (3 * Math.PI / 4 < angle) {
    direction = 3;
  } else if (angle < - 3 * Math.PI / 4) {
    direction = 3;
  } else {
    direction = 0;
  }

  return direction;
}

function gameXToScreenX(x) {
  return (SCALE * x) + TRANSLATE_X;
}

function gameYToScreenY(y) {
  return (SCALE * y) + TRANSLATE_Y;
}

function absScale(n) {
  return SCALE * n;
}
