(() => {
  var SONGS = ["bigiron", "coolranch"];
  var SONG_INDEX = Math.floor(Math.random() * SONGS.length);

  var STEREO = document.getElementById("stereo");
  var soundToggle = document.getElementById("sound-toggle");
  var soundOn = document.getElementById("sound-on");
  var soundOff = document.getElementById("sound-off");
  var nextSong = document.getElementById("sound-next");

  var SOUND_ON = true;
  var savedSoundOn = localStorage.getItem('SOUND_ON');
  if (savedSoundOn !== null) {
    SOUND_ON = savedSoundOn;
    if (SOUND_ON === "false") {
      SOUND_ON = false;
    }
    SOUND_ON = !SOUND_ON;
    toggleVolume();
  }

  // play the next song whenever one finishes
  STEREO.addEventListener("ended", handleNextSong);

  // users can skip to the next song
  nextSong.addEventListener("click", handleNextSong);

  // users can mute / unmute song
  soundToggle.addEventListener("click", toggleVolume);
  
  function toggleVolume() {
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
    localStorage.setItem('SOUND_ON', SOUND_ON);
  };

  function handleNextSong() {
    SONG_INDEX++;
    SONG_INDEX %= SONGS.length;
    STEREO.src = "midi/" + SONGS[SONG_INDEX] + ".mp3";
  };
})()