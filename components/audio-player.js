class AudioPlayer {
  constructor() {}

  play(el) {
    if (!el.ended) {
      this._stop(el);
    }
    el.play();
  }

  _stop(el) {
    el.pause();
    el.currentTime = 0.0;
  }
}