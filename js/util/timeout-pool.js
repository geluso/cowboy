// unused
class TimeoutPool {
  constructor() {
    this.intervalTimers = []
    this.timeoutTimers = []
  }

  clearTimers() {
    for (let n = 0; n < this.timeoutTimers.length; n++) {
      clearInterval(this.timeoutTimers[n]);
    }

    for (let i = 0; i < this.intervalTimers.length; i++) {
      clearInterval(this.intervalTimers[i]);
    }
    this.intervalTimers = []
    this.timeoutTimers = []
  }

  addInterval(cb, delay) {

  }

  addTimeout(cb, delay) {

  }
}