class Drawable {
  constructor(x, y, label) {
    this.x = x
    this.y = y
    this.label = label
  }

  setPosition(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  draw(ctx) {
    draw_actor(ctx, this);
  }

  // Adds the Drawable to the list of Drawables.
  build() {
    if (!this.hasImage || this.x == null || this.y == null) {
      window.console.error("Unable to build " + this.label + ".");
      return;
    }

    DRAWABLES.push(this);
  }

  // Returns true if an image has been specified.
  get hasImage() {
    return this.imageName != null;
  }
  
  get image() {
    return this.hasImage ? IMAGES[this.imageName] : null;
  }
  
  set image(image) {
    this.imageName = image;
  }
}
