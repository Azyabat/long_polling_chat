class ConsoleBuffer {
  constructor() {
    this.buffer = [];
  }

  add(el) {
    const addBuffer = this.buffer;
    addBuffer.push(el);
    this.buffer = addBuffer;
  }

  clear() {
    this.buffer = [];
  }
}

module.exports = new ConsoleBuffer();
