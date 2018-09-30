class Drawable {
  constructor(xx, yy, label) {
    this.setPosition(xx, yy);
    this.label = label;
  }

  setPosition(xx, yy) {
    this.x = xx || 0;
    this.y = yy || 0;
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
    return this;
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
