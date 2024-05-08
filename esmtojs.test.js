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

// Exporting declarations
// export let name1, name2; // also var
// export const name1 = 1, name2 = 2; // also var, let
// export function functionName() {}
// export class ClassName {}
// export function* generatorFunctionName() {}
// export const { name1, name2: bar } = o;
// export const [ name1, name2 ] = array;
//
// Export list
// export { name1, nameN };
// export { variable1 as name1, variable2 as name2, nameN };
// export { variable1 as "string name" };
// export { name1 as default };
//
// Default exports
// export default expression;
// export default function functionName() {}
// export default class ClassName {}
// export default function* generatorFunctionName() {}
// export default function () {}
// export default class {}
// export default function* () {}
//
// Aggregating modules
// export * from "module-name";
// export * as name1 from "module-name";
// export { name1, nameN } from "module-name";
// export { import1 as name1, import2 as name2, nameN } from "module-name";
// export { default, named } from "module-name";
// export { default as name1 } from "module-name";

const esmExportDeclarations01 = `
export let name1, name2; // also var`

test('convert exmExportDeclarations01', () => {
  assert.strictEqual(
    esmtojs(esmExportDeclarations01, 'exportdecl01', {}), `
let exportdecl01 = (esmtojs => {

let name1, name2; // also var
Object.assign(esmtojs.named, {name1,name2})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmExportDeclarations02 = `
export const name1 = 1, name2 = 2; // also var, let`

test('convert exmExportDeclarations02', () => {
  assert.strictEqual(
    esmtojs(esmExportDeclarations02, 'exportname', {}), `
let exportname = (esmtojs => {

const name1 = 1, name2 = 2; // also var, let
Object.assign(esmtojs.named, {name1,name2})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmExportDeclarations03 = `
export function functionName() {
// …
}`

test('convert exmExportDeclarations03', () => {
  assert.strictEqual(
    esmtojs(esmExportDeclarations03, 'exportname', {}), `
let exportname = (esmtojs => {

function functionName() {
// …
}
Object.assign(esmtojs.named, {functionName})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmExportDeclarations04 = `
export class ClassName {
// …
}`

test('convert exmExportDeclarations04', () => {
  assert.strictEqual(
    esmtojs(esmExportDeclarations04, 'exportname', {}), `
let exportname = (esmtojs => {

class ClassName {
// …
}
Object.assign(esmtojs.named, {ClassName})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmExportDeclarations05 = `
export function* generatorFunctionName() {
// …
}`

test('convert exmExportDeclarations05', () => {
  assert.strictEqual(
    esmtojs(esmExportDeclarations05, 'exportname', {}), `
let exportname = (esmtojs => {

function* generatorFunctionName() {
// …
}
Object.assign(esmtojs.named, {generatorFunctionName})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

const esmExportDeclarations06 = `
export const { name1, name2: bar } = o;`

test('convert exmExportDeclarations06', () => {
  assert.strictEqual(
    esmtojs(esmExportDeclarations06, 'exportname', {}), `
let exportname = (esmtojs => {

const { name1, name2: bar } = o;
Object.assign(esmtojs.named, {name1,name2})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export const [ name1, name2 ] = array;
// same as named-exports
// { name1: 'name1', name2: 'name2' }
const esmExportDeclarations07 = `
export const [ name1, name2 ] = array;`

test('convert exmExportDeclarations07', () => {
  assert.strictEqual(
    esmtojs(esmExportDeclarations07, 'exportname', {}), `
let exportname = (esmtojs => {

const [ name1, name2 ] = array;
Object.assign(esmtojs.named, {name1,name2})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// Export list
// export { name1, nameN };
// export { variable1 as name1, variable2 as name2, nameN };
// export { variable1 as "string name" };
// export { name1 as default, variable1 as name1, nameN };
const esmExportList01 = `
export { name1, nameN };`

test('convert exmExportList01', () => {
  assert.strictEqual(
    esmtojs(esmExportList01, 'exportname', {}), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, {name1,nameN})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export { variable1 as name1, variable2 as name2, nameN };
const esmExportList02 = `
export { variable1 as name1, variable2 as name2, nameN };`

test('convert exmExportList02', () => {
  assert.strictEqual(
    esmtojs(esmExportList02, 'exportname', {}), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, {name1:variable1,name2:variable2,nameN})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export { variable1 as name1, variable2 as name2, nameN };
const esmExportList03 = `
export { variable1 as "string name" };`

test('convert exmExportList03', () => {
  assert.strictEqual(
    esmtojs(esmExportList03, 'exportname', {}), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, {"string name":variable1})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export { name1 as default, variable1 as name1, nameN };
const esmExportList04 = `
export { name1 as default, variable1 as name1, nameN };`

test('convert exmExportList04', () => {
  assert.strictEqual(
    esmtojs(esmExportList04, 'exportname', {}), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, {default:name1,name1:variable1,nameN})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// Default exports
// export default expression;
// export default function functionName() {}
// export default class ClassName {}
// export default function* generatorFunctionName() {}
// export default function () {}
// export default class {}
// export default function* () {}
const esmDefaultExport01 = `
export default expression;`

test('convert esmDefaultExport01', () => {
  assert.strictEqual(
    esmtojs(esmDefaultExport01, 'exportname', {}), `
let exportname = (esmtojs => {

esmtojs.all.default = expression;

Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export default function functionName() {}
const esmDefaultExport02 = `
export default function functionName() {};`

test('convert esmDefaultExport02', () => {
  assert.strictEqual(
    esmtojs(esmDefaultExport02, 'exportname', {}), `
let exportname = (esmtojs => {

esmtojs.all.default = function functionName() {};

Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export default class ClassName {}
const esmDefaultExport03 = `
export default class ClassName {}`

test('convert esmDefaultExport03', () => {
  assert.strictEqual(
    esmtojs(esmDefaultExport03, 'exportname', {}), `
let exportname = (esmtojs => {

esmtojs.all.default = class ClassName {}

Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export default function* generatorFunctionName() {}
const esmDefaultExport04 = `
export default function* generatorFunctionName() {}`

test('convert esmDefaultExport04', () => {
  assert.strictEqual(
    esmtojs(esmDefaultExport04, 'exportname', {}), `
let exportname = (esmtojs => {

esmtojs.all.default = function* generatorFunctionName() {}

Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export default function () {}
const esmDefaultExport05 = `
export default function () {}`

test('convert esmDefaultExport05', () => {
  assert.strictEqual(
    esmtojs(esmDefaultExport05, 'exportname', {}), `
let exportname = (esmtojs => {

esmtojs.all.default = function () {}

Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export default class {}
const esmDefaultExport06 = `
export default class {}`

test('convert esmDefaultExport06', () => {
  assert.strictEqual(
    esmtojs(esmDefaultExport06, 'exportname', {}), `
let exportname = (esmtojs => {

esmtojs.all.default = class {}

Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export default function* () {}
const esmDefaultExport07 = `
export default function* () {}`

test('convert esmDefaultExport07', () => {
  assert.strictEqual(
    esmtojs(esmDefaultExport07, 'exportname', {}), `
let exportname = (esmtojs => {

esmtojs.all.default = function* () {}

Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// Aggregating modules
// export * from "module-name";
// export * as name1 from "module-name";
// export { name1, nameN } from "module-name";
// export { import1 as name1, import2 as name2, nameN } from "module-name";
// export { default, named } from "module-name";
// export { default as name1 } from "module-name";
const esmAggregating01 = `
export * from "module-name";`

test('convert esmAggregating01', () => {
  assert.strictEqual(
    esmtojs(esmAggregating01, 'exportname', {
      'module-name': 'testA'
    }), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, testA.named)
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export * as name1 from "module-name";
const esmAggregating02 = `
export * as name1 from "module-name";`

test('convert esmAggregating02', () => {
  assert.strictEqual(
    esmtojs(esmAggregating02, 'exportname', {
      'module-name': 'testA'
    }), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, {name1:testA.named})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export { name1, nameN } from "module-name";
const esmAggregating03 = `
export { name1, nameN } from "module-name";`

test('convert esmAggregating03', () => {
  assert.strictEqual(
    esmtojs(esmAggregating03, 'exportname', {
      'module-name': 'testA'
    }), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, {name1:testA.all.name1})
Object.assign(esmtojs.named, {nameN:testA.all.nameN})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export { import1 as name1, import2 as name2, nameN } from "module-name";
const esmAggregating04 = `
export { import1 as name1, import2 as name2, nameN } from "module-name";`

test('convert esmAggregating04', () => {
  assert.strictEqual(
    esmtojs(esmAggregating04, 'exportname', {
      'module-name': 'testA'
    }), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, {name1:testA.all.import1})
Object.assign(esmtojs.named, {name2:testA.all.import2})
Object.assign(esmtojs.named, {nameN:testA.all.nameN})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export { default, named } from "module-name";
const esmAggregating05 = `
export { default, named } from "module-name";`

test('convert esmAggregating05', () => {
  assert.strictEqual(
    esmtojs(esmAggregating05, 'exportname', {
      'module-name': 'testA'
    }), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.all, {default:testA.all.default})
Object.assign(esmtojs.named, {named:testA.all.named})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

// export { default as name1 } from "module-name";
const esmAggregating06 = `
export { default as name1 } from "module-name";`

test('convert esmAggregating06', () => {
  assert.strictEqual(
    esmtojs(esmAggregating06, 'exportname', {
      'module-name': 'testA'
    }), `
let exportname = (esmtojs => {

0;
Object.assign(esmtojs.named, {name1:testA.all.default})
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})
`.slice(1, -1))
})

