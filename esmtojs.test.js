import test from 'node:test'
import assert from 'node:assert/strict'
import esmtojs, { buildImportReplaceRe } from './esmtojs.js'

test('buildImportReplaceRe', () => {
  const str = 'import { "stringname" as alias08 } from "module-name-08";'
  const re = buildImportReplaceRe('module-name-08')

  const strfin = str.replace(re, (match, g1, g2, g4) => (
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

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))

  assert.strictEqual(
    esmtojs(esmBasic02, 'test02', {}), `
let test02 = (esmtojs => {

esmtojs.all.default = Object.assign(domwh, {
  window: domwhwindow
})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))  
})

const esmImport03 = `
import defaultExport01 from "module-name-01";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport03, 'test03', {
      'module-name-01': 'testA'
    }), `
let test03 = (esmtojs => {

const defaultExport01 = testA.all.default;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImport04 = `
import * as name02 from "module-name-02";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport04, 'test04', {
      'module-name-02': 'testA'
    }), `
let test04 = (esmtojs => {

const name02 = testA.named;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImport05 = `
import { export03 } from "module-name-03";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport05, 'test05', {
      'module-name-03': 'testA'
    }), `
let test05 = (esmtojs => {

const { export03 } = testA.named;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImport06 = `
import { export04 as alias04 } from "module-name-04";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport06, 'test06', {
      'module-name-04': 'testA'
    }), `
let test06 = (esmtojs => {

const { export04: alias04 } = testA.named;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImport07 = `
import { default as alias05 } from "module-name-05";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport07, 'test07', {
      'module-name-05': 'testA'
    }), `
let test07 = (esmtojs => {

const { default: alias05 } = testA.all;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImport08 = `
import { export061, export062 } from "module-name-06";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport08, 'test08', {
      'module-name-06': 'testA'
    }), `
let test08 = (esmtojs => {

const { export061, export062 } = testA.named;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImport09 = `
import { export071, export072 as alias072, export073 } from "module-name-07";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport09, 'test09', {
      'module-name-07': 'testA'
    }), `
let test09 = (esmtojs => {

const { export071, export072: alias072, export073 } = testA.named;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImport10 = `
import { "stringname" as alias08 } from "module-name-08";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport10, 'test10', {
      'module-name-08': 'testA'
    }), `
let test10 = (esmtojs => {

const { "stringname": alias08 } = testA.named;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})


const esmImport11 = `
import { export091a, export092a }, defaultExport09a from "module-name-09a";
import defaultExport09b, { export091b, export092b } from "module-name-09b";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport11, 'test10', {
      'module-name-09a': 'testA',
      'module-name-09b': 'testB'
    }), `
let test10 = (esmtojs => {

const defaultExport09a = testA.all.default
const { export091a, export092a } = testA.named;
const defaultExport09b = testB.all.default
const { export091b, export092b } = testB.named;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImport12 = `
import defaultExport10a, * as name10a from "module-name-10a";
import * as name10b, defaultExport10b from "module-name-10b";

export default 'hello world'`

test('convert simple esm imports', () => {
  assert.strictEqual(
    esmtojs(esmImport12, 'test11', {
      'module-name-10a': 'testA',
      'module-name-10b': 'testB'
    }), `
let test11 = (esmtojs => {

const defaultExport10a = testA.all.default
const name10a = testA.named;
const defaultExport10b = testB.all.default
const name10b = testB.named;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmImportALL = `
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
    esmtojs(esmImportALL, 'test12', {
      'module-name-01': 'testa',
      'module-name-02': 'testb',
      'module-name-03': 'testc',
      'module-name-04': 'testd',
      'module-name-05': 'teste',
      'module-name-06': 'testf',
      'module-name-07': 'testg',
      'module-name-08': 'testh',
      'module-name-09': 'testi',
      'module-name-10': 'testj',
      'module-name-11': 'testk'
    }), `
let test12 = (esmtojs => {

const defaultExport01 = testa.all.default;
const name02 = testb.named;
const { export03 } = testc.named;
const { export04: alias04 } = testd.named;
const { default: alias05 } = teste.all;
const { export061, export062 } = testf.named;
const { export071, export072: alias072, export073 } = testg.named;
const { "stringname": alias08 } = testh.named;
const defaultExport09 = testi.all.default
const { export091, export092 } = testi.named;
const defaultExport10 = testj.all.default
const name10 = testj.named;
const testk.all.default;

esmtojs.all.default = 'hello world'
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})
