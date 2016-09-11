/**
  Creates a new Drawable.
  
  parameter label: string
*/
function Drawable(label) {
  this.label = label;
}

Drawable.prototype = {
  /**
    Sets the position of the Drawable.
    
    parameters:
      - x: number
      - y: number
  */
  setPosition: function(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  },

  /**
    Draws the Drawable within the given context.
    
    parameter ctx: CanvasRenderingContext2D
  */
  draw: function(ctx) {
    draw_actor(ctx, this);
  },

  /**
    Adds the Drawable to the list of Drawables.
  */
  build: function() {
    if (!this.hasImage ||
        this.x == null ||
        this.y == null) {
      window.console.error("Unable to build " + this.label + ".");
      return;
    }

    DRAWABLES.push(this);
  },

  // Returns true if an image has been specified.
  get hasImage() {
    return this.imageName != null;
  },
  
  get image() {
    return this.hasImage ? IMAGES[this.imageName] : null;
  },
  
  set image(image) {
    this.imageName = image;
  }
}
