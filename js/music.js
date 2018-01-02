(() => {
  var SOUND_ON = true;

  var SONGS = ["bigiron", "coolranch"];
  var SONG_INDEX = 0;

  var STEREO = document.getElementById("stereo");
  var soundOn = document.getElementById("sound-on");
  var soundOff = document.getElementById("sound-off");

  // users can mute / unmute song
  document.getElementById("sound-controls").addEventListener("click", () => {
    SOUND_ON = !SOUND_ON;
    if(SOUND_ON) {
      STEREO.volume = 1;
      soundOn.classList.remove("hidden");
      soundOff.classList.add("hidden");
    } else {
      STEREO.volume = 0;
      soundOff.classList.remove("hidden");
      soundOn.classList.add("hidden");
    }
  });

  // play the next song whenever one finishes
  STEREO.addEventListener("ended", nextSong);
  function nextSong() {
    SONG_INDEX++;
    SONG_INDEX %= SONGS.length;
    STEREO.src = "midi/" + SONGS[SONG_INDEX] + ".mp3";
  };

  // start it playing!
  nextSong();
})()