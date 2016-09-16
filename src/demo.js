/* eslint-disable no-console */
import MeterStream from './'

process.stdin
  .pipe(new MeterStream(5))
  .on('error', (err) => {
    console.error('Read more than 5 bytes from stdin')
    console.error(err)
    process.exit(1)
  })
  .pipe(process.stdout)
