esmtojs
=======
**(c)[Bumblehead][0]**

[![npm version](https://badge.fury.io/js/esmtojs.svg)](https://badge.fury.io/js/esmtojs) [![Build Status](https://github.com/iambumblehead/esmtojs/workflows/test/badge.svg)][2]

Returns a vanilla js expression from an esm file string. No transpiler is used. This module provides a zero-dependency, transpiler-free way to remove esm from modules. Resulting expressions can be used in ways prohibited by esm format.
```javascript
import esmtojs from 'esmtojs'

const esm = "export default 'hello worlds'"
esmtojs(esm, 'example1')
// let test01 = (esmtojs => {
// esmtojs = 'hello worlds'
// })({})
```

[0]: http://www.bumblehead.com "bumblehead"
