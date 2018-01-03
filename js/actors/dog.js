class Dog {
  constructor() {
    this.alive = true;
    this.direction = EAST;
    this.x = 0;
    this.y = 0;
  }

  get label() {
    return "dog";
  }

  get image() {
    // north east south west
    var direction = ["dog-east", "dog-east", "dog-west", "dog-west"][this.direction];
    return IMAGES[direction]; 
  }

  update() {
    this.x++;
  }

  draw(ctx) {
    this.update();
    draw_actor(ctx, this);
  }
}