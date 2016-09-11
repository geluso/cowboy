function build_billboard() {
  var billboard = new AnimatedDrawable("billboard");
  billboard.setPosition(50, -100);

  var frames = ["billboard_0",
                "billboard_1",
                "billboard_2",
                "billboard_3"];
  var timings = [8000, 400, 400, 600];

  billboard.addFrames(frames, timings);
  billboard.build();
}