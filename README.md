# meterstream

[![Build Status](https://travis-ci.org/blockai/meterstream.svg?branch=master)](https://travis-ci.org/blockai/meterstream)

Transform stream that emits a `MeterStream.OverflowError` error if it has
read more than `maxBytes` bytes.

Note: the readable side of the transform will likely emit less than
`maxBytes` if the OverflowError is thrown because it can't both push the
remaining data and emit an error.

## Install

```bash
npm install --save meterstream
```

Requires Node v6+

## Usage

**new MeterStream(maxBytes = Infinity)**

Returns a pass through stream where `maxBytes` (defaults to `Infinity`)
is the max number of bytes to pass through before emitting an error.

See [./test](./test) directory for usage examples.

```javascript
import MeterStream from 'meterstream'

process.stdin
  .pipe(new MeterStream(15))
  .on('error', (err) => {
    console.error('Read more than 15 bytes from stdin')
    console.error(err)
    process.exit(1)
  })
  .pipe(process.stdout)


// $ babel-node src/demo.js
// hello
// hello
// have we
// have we
// reached 15 bytes yet?
// Read more than 15 bytes from stdin
// Error: Stream exceeded specified max of 15 bytes.
//     at OverflowError ...
```