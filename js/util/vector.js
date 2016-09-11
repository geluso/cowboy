function vectorDistance(v1, v2) {
  return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
}

function vectorLength(vector) {
  var length = vectorDistance(vector, {x: 0, y: 0});
  return length;

}

function capVector(vector, length) {
  if (vectorLength(vector) > length) {
    var unit = unitVectorFromVector(vector);
    var capped = scaleVector(unit, length);
    return capped;
  }
  return vector;
}

function randomUnitVector() {
  var vector = {
    x: Math.random() - .5,
    y: Math.random() - .5,
  }

  vector = unitVectorFromVector(vector);
  return vector;
}

function unitVectorFromVector(vector) {
  return unitVector(vector.x, vector.y);
}

function unitVector(x, y) {
  var angle = angleFromOrigin(x, y);

  var vx = Math.cos(angle);
  var vy = Math.sin(angle);

  var vector = {
    x: vx,
    y: vy
  }

  return vector;
}

function scaleVector(vector, scale) {
  var result = {
    x: vector.x * scale,
    y: vector.y * scale,
  };
  return result;
}

function vectorAdd(v1, v2) {
  var result = {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  }
  return result;
}

