function playAudio(id, cb) {
  let noise = document.createElement('audio')
  noise.src = document.getElementById(id).src
  noise.play()

  noise.addEventListener('ended', cb)
}