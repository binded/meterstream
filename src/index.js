import { Transform } from 'stream'

class OverflowError extends Error {}

class MeterSream extends Transform {
  constructor(maxSize = Infinity) {
    super()
    this.maxSize = maxSize
    this.byteCount = 0
  }
  _transform(chunk, encoding, cb) {
    // if this is called, _flush isn't called
    if (this.err) return cb(this.err)
    if (this.maxSize === Infinity) return cb(null, chunk)
    this.byteCount += chunk.length
    if (this.byteCount > this.maxSize) {
      const remainingBytes = this.maxSize - this.byteCount
      const lastChunk = chunk.slice(0, remainingBytes)
      this.err = new OverflowError(
        `Stream exceeded specified max of ${this.maxSize} bytes.`
      )
      // flush remaining chunk and wait until next
      // _transform or _flush call to emit error
      return cb(null, lastChunk)
    }
    cb(null, chunk)
  }
  // if error detected on last call to _transform
  // flush will be called with the error
  _flush(cb) {
    cb(this.err)
  }
}
MeterSream.OverflowError = OverflowError

export default MeterSream
