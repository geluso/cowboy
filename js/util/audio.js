function playAudio(id, cb) {
  let noise = document.createElement('audio')
  noise.src = document.getElementById(id).src
  noise.play()

  // TODO: 'ended' event on audio elements doesn't fire
  // let listener = noise.addEventListener('ended', cb)
}