# meterstream

[![Build Status](https://travis-ci.org/blockai/meterstream.svg?branch=master)](https://travis-ci.org/blockai/meterstream)

Transform stream that emits a `MeterStream.OverflowError` error if it has
read more than `maxBytes` bytes.

Note: if more than `maxBytes` is read, the transform will ensure that
exactly `maxBytes` have been flushed to the readable side before
emitting the OverflowError.

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
  .pipe(new MeterStream(5))
  .on('error', (err) => {
    console.error('Read more than 5 bytes from stdin')
    console.error(err)
    process.exit(1)
  })
  .pipe(process.stdout)


// echo -n "123456789" | babel-node src/demo.js
// 12345Read more than 5 bytes from stdin
// Error: Stream exceeded specified max of 5 bytes.
//     at OverflowError (...)
//     at ....
```