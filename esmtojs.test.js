import test from 'node:test'
import assert from 'node:assert/strict'
import esmtojs from './esmtojs.js'

const esmBasic01 = `
export default 'hello world'`

const esmBasic02 = `
export default Object.assign(domwh, {
  window: domwhwindow
})`

test('convert simple esm module', () => {
  assert.strictEqual(
    esmtojs(esmBasic01, 'test01', {}), `
let test01 = (esmtojs => {

esmtojs = 'hello worlds'
})({})
`.slice(1, -1))
})
