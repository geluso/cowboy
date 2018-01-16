class Buckshot {
  constructor() {
    this.x = 0
    this.y = 0
  }

  draw(ctx, x, y) {
    ctx.fillStyle = 'black'
    let xx = (this.x + x)
    let yy = (this.y + y)
    ctx.fillRect(xx, yy, 1, 1)
  }

  get image() {
    return {width: 1, height: 1, src: undefined}
  }
}

class ShotgunBlast {
  constructor(x, y, angle) {
    this.x = x
    this.y = y
    this.angle = angle
    this.speed = 12

    this.buckshots = []

    let maxBuckshots = 30
    for (let i = 0; i < maxBuckshots; i++) {
      let buck = new Buckshot()
      buck.x += Math.random() * 32
      buck.y += Math.random() * 8
      this.buckshots.push(buck)
    }

    PROJECTILES.push(this)
  }

  draw(ctx) {
    this.x += this.speed * Math.cos(this.angle);
    this.y += -this.speed * Math.sin(this.angle);
    for (let i = 0; i < this.buckshots.length; i++) {
      this.buckshots[i].draw(ctx, this.x, this.y)
    }
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
  }

  get image() {
    return {width: 15, height: 15, src: undefined}
  }
}