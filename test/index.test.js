import test from 'blue-tape'
import concat from 'concat-stream'
import { Readable } from 'stream'

import MeterStream from '../src'

const arrToReadStream = (arr) => (
  new Readable({
    read() {
      const buf = arr.shift()
      process.nextTick(() => {
        if (typeof buf === 'undefined') {
          return this.push(null)
        }
        this.push(buf)
      })
    },
  })
)

test('max size not reached', (t) => {
  const rs = arrToReadStream([Buffer.alloc(10)])
  rs.pipe(new MeterStream(100))
    .on('error', t.fail)
    .pipe(concat((buf) => {
      t.equal(buf.length, 10)
      t.end()
    }))
})

test('exactly max size', (t) => {
  const rs = arrToReadStream([Buffer.alloc(100)])
  rs.pipe(new MeterStream(100))
    .on('error', t.fail)
    .pipe(concat((buf) => {
      t.equal(buf.length, 100)
      t.end()
    }))
})

test('max size exceeded after 1 chunk', (t) => {
  const rs = arrToReadStream([Buffer.from('12345678')])
  const chunks = []
  rs.pipe(new MeterStream(5))
    .on('error', (err) => {
      t.ok(err instanceof MeterStream.OverflowError)
      const buf = Buffer.concat(chunks)
      t.equal(buf.toString(), '12345')
      t.equal(buf.length, 5)
      t.end()
    })
    .on('data', (chunk) => chunks.push(chunk))
})

test('max size exceeded after 3 chunks', (t) => {
  const rs = arrToReadStream([Buffer.alloc(10, 'a'), Buffer.alloc(90, 'b'), Buffer.alloc(1, 'c')])
  const chunks = []
  rs.pipe(new MeterStream(100))
    .on('error', (err) => {
      t.ok(err instanceof MeterStream.OverflowError)
      const buf = Buffer.concat(chunks)
      t.equal(buf.length, 100)
      t.end()
    })
    .on('data', (chunk) => chunks.push(chunk))
})
