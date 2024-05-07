import test from 'node:test'
import assert from 'node:assert/strict'
import esmtojs, { buildImportReplaceRe } from './esmtojs.js'


test('buildImportReplaceRe', () => {
  const str = 'import { "stringname" as alias08 } from "module-name-08";'
  const re = buildImportReplaceRe('module-name-08')

  // const { default: stringname } = { default: re }
  // console.log({ stringname })
  // console.log({ re })
  const strfin = str.replace(re, (match, g1, g2, g4) => (
    // console.log({ g1, g2 }),
    match.replace(g4, `'replaced'`)))

  assert.strictEqual(
    strfin, `import { "stringname" as alias08 } from 'replaced';`)
})



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

esmtojs = 'hello world'
})({})
`.slice(1, -1))

  assert.strictEqual(
    esmtojs(esmBasic02, 'test02', {}), `
let test02 = (esmtojs => {

esmtojs = Object.assign(domwh, {
  window: domwhwindow
})
})({})
`.slice(1, -1))  
})

const esmImport01 = `
import defaultExport01 from "module-name-01";
import * as name02 from "module-name-02";
import { export03 } from "module-name-03";
import { export04 as alias04 } from "module-name-04";
import { default as alias05 } from "module-name-05";
import { export061, export062 } from "module-name-06";
import { export071, export072 as alias072, export073 } from "module-name-07";
import { "stringname" as alias08 } from "module-name-08";
import defaultExport09, { export091, export092 } from "module-name-09";
import defaultExport10, * as name10 from "module-name-10";
import "module-name-11";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport01, 'test03', {
      'module-name-01': './local/test-module-name-01.js',
      'module-name-02': './local/test-module-name-02.js',
      'module-name-03': './local/test-module-name-03.js',
      'module-name-04': './local/test-module-name-04.js',
      'module-name-05': './local/test-module-name-05.js',
      'module-name-06': './local/test-module-name-06.js',
      'module-name-07': './local/test-module-name-07.js',
      'module-name-08': './local/test-module-name-08.js',
      'module-name-09': './local/test-module-name-09.js',
      'module-name-10': './local/test-module-name-10.js',
      'module-name-11': './local/test-module-name-11.js'
    }), `
let test03 = (esmtojs => {

import defaultExport01 from './local/test-module-name-01.js';
import * as name02 from './local/test-module-name-02.js';
import { export03 } from './local/test-module-name-03.js';
import { export04 as alias04 } from './local/test-module-name-04.js';
import { default as alias05 } from './local/test-module-name-05.js';
import { export061, export062 } from './local/test-module-name-06.js';
import { export071, export072 as alias072, export073 } from './local/test-module-name-07.js';
import { "stringname" as alias08 } from './local/test-module-name-08.js';
import defaultExport09, { export091, export092 } from './local/test-module-name-09.js';
import defaultExport10, * as name10 from './local/test-module-name-10.js';
import './local/test-module-name-11.js';

esmtojs = 'hello world'
})({})
`.slice(1, -1))
})

