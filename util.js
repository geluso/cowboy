function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function actor_distance(a1, a2) {
  return distance(a1.x, a1.y, a2.x, a2.y);
}

