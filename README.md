esmtojs
=======
**(c)[Bumblehead][0]**

[![npm version](https://badge.fury.io/js/esmtojs.svg)](https://badge.fury.io/js/esmtojs) [Build Status](https://github.com/iambumblehead/esmtojs/workflows/test/badge.svg)

Returns a vanilla js expression from an esm file string, so that resulting expressions can be used in ways prohibited by esm format.

Ths script uses regular expressions. This reduces accuracy but keeps the script small and independant of any dependency that could be a moving target.

Warning: transforming esm format requires many decisions that are at once complex, subjective and consequential.
```javascript
import esmtojs from 'esmtojs'

const esm = `
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

esmtojs(esm, 'test12', {
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
})
// let test12 = (esmtojs => {
//
// const defaultExport01 = testa.all.default;
// const name02 = testb.named;
// const { export03 } = testc.named;
// const { export04: alias04 } = testd.named;
// const { default: alias05 } = teste.all;
// const { export061, export062 } = testf.named;
// const { export071, export072: alias072, export073 } = testg.named;
// const { "stringname": alias08 } = testh.named;
// const defaultExport09 = testi.all.default
// const { export091, export092 } = testi.named;
// const defaultExport10 = testj.all.default
// const name10 = testj.named;
// const testk.all.default;
//
// esmtojs.all.default = 'hello world'
// Object.assign(esmtojs.all, esmtojs.named)
// })({all:{},named:{}})
```

[0]: http://www.bumblehead.com "bumblehead"
