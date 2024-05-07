const enumKeywordIMPORT = 'import'

const reKeywordFROM = /(?:[ \t\n\r])(from)(?:[ \t\n\r])/
const reSpacesANY = /[ \t\n\r]/
const reGlobAS = /[ \t\n\r]?\*[ \t\n\r](as)/
const reDEFAULTAS = /[ \t\n\r]?(default)[ \t\n\r](as)/
const reNAMEDAS = /[ \t\n\r]?([^ \t\n\r]*)[ \t\n\r](as)/
const reNAMEDASGROUP = /([^ \t\n\r]*)[ \t\n\r](as)[ \t\n\r]([^ \t\n\r]*)/
// const reMIXEDNAMEDDEFAULT = /({[^}*]})([ \t\n\r,]*)?(.*)/
// const reMIXEDNAMEDDEFAULT = /([ \t\n\r,]*)?([ \t\n\r,]*)?({[^}*]})([ \t\n\r,]*)?([ \t\n\r,]*)?/
const reMIXEDDEFAULTNAMED = /^([^ \t\n\r,{]*)([ \t\n\r,]*)({[^}]*})/
const reMIXEDNAMEDDEFAULT = /^({[^}]*})([ \t\n\r,]*)([^ \t\n\r,}]*)/

// const reMIXEDDEFAULTGLOBBED = /^([^ \t\n\r,{]*)([ \t\n\r,]*)( as[ \t\n\r,]*)([^ \t\n\r]*)/
// const reMIXEDDEFAULTGLOBBED = /^([^ \t\n\r,{]*)([ \t\n\r,]*)(\*|{[^}]*})( as[ \t\n\r,]*)([^ \t\n\r]*)/
const reMIXEDDEFAULTGLOBBED = /^([^ \t\n\r,{]*)([ \t\n\r,]*)(\*|{[^}]*})( as[ \t\n\r,]*)([^ \t\n\r]*)/
// const reMIXEDDEFAULTGLOBBED = /^([\w]*)([ \t\n\r,]*)(\*|{[^}]*})( as[ \t\n\r,]*)([^ \t\n\r]*)/
const reMIXEDGLOBBEDDEFAULT = /^([ \t\n\r,]*)(\*|{[^}]*})( as[ \t\n\r]*)([^,]*),[ \t\n\r,]?([^ \t\n\r]*)/

const closuretpl = `let :name = (esmtojs => {
:filestr
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})`

export const buildImportReplaceRe = key => (
  key = key.replace('/', '\\/').replace('.', '\\.'),
  // '$' dollar sign used in immutable.js import variable name :(
  // '/' comment slash used in comments inside import expression
  new RegExp(
    '(import|export)' + // dollar sign used in immutable.js
      `(?:[\\s.*]([\\w*{}\n\r\t,"' /$]+)[\\s*]from)?[\\s*](?:(["']${key}["']))`,
    'gm'))

export default (esmstr, name, importmap, jsstr) => {
  jsstr = closuretpl
    .replace(/:name/, name)
    .replace(/:filestr/, esmstr)

  jsstr = jsstr.replace(
    /export default/g, 'esmtojs.all.default =')

  jsstr = Object.keys(importmap).reduce((str, key) => {
    const re = buildImportReplaceRe(key)
    return str.replace(re, (match, g1, g2, g3, g4) => {
      // 'optional use stringy or object',
      // console.log({ match, g1, g2, g3, g4 })
      if (g1 === enumKeywordIMPORT) {
        if (String(g2).endsWith('}') && !String(g2).startsWith('{')) {
          // match: 'import defaultExport09, { export091, export092 } from "module-name-09"',
          // g1: 'import',
          // g2: 'defaultExport09, { export091, export092 }',
          // g3: '"module-name-09"',
          match = g2.replace(reMIXEDDEFAULTNAMED, (m, mdefault, a2, mnamed) => {
            return [
              `const ${mdefault} = ${importmap[key]}.all.default`,
              `const ${mnamed} = ${importmap[key]}.named`
            ].join('\n')
          })

          return match
        }
        else if (!String(g2).endsWith('}') && String(g2).startsWith('{')) {
          // match: 'import defaultExport09 { export091, export092 }, defaultExport09 from "module-name-09"',
          // g1: 'import',
          // g2: 'defaultExport09, { export091, export092 }',
          // g3: '"module-name-09"'
          match = g2.replace(reMIXEDNAMEDDEFAULT, (m, mnamed, a2, mdefault) => {
            return [
              `const ${mdefault} = ${importmap[key]}.all.default`,
              `const ${mnamed} = ${importmap[key]}.named`
            ].join('\n')
          })

          return match
        }            
        else if (String(g2).endsWith('}') && String(g2).startsWith('{')) {
          if (reDEFAULTAS.test(g2)) {
            // match: 'import { default as alias05 } from "module-name-05"',
            // g1: 'import',
            // g2: '{ default as alias05 }',
            // g3: '"module-name-05"',            
            //
            // const { default: alias05 } = testA.all;
            match = match
              .replace(g3, `${importmap[key]}.all`)
            match = match.replace(g2, g2.replace(reNAMEDASGROUP, (m, n1, n2, n3) => {
              return `${n1}: ${n3}`
            }))
            match = match.replace(reKeywordFROM, (ma, matchfrom) => (
              ma.replace(matchfrom, '=')))
          }
          else if (reNAMEDAS.test(g2)) {
            // match: 'import { export04 as alias04 } from "module-name-04"',
            // g1: 'import',
            // g2: '{ export04 as alias04 }',
            // g3: '"module-name-04"',
            //
            // const { alias04: export04 } = testA.named;
            match = match
              .replace(g3, `${importmap[key]}.named`)
            match = match.replace(g2, g2.replace(reNAMEDASGROUP, (m, n1, n2, n3) => {
              return `${n1}: ${n3}`
            }))
            match = match.replace(reKeywordFROM, (ma, matchfrom) => (
              ma.replace(matchfrom, '=')))
          } else {
            // match: 'import { export03 } from "module-name-03"',
            // g1: 'import',
            // g2: '{ export03 }',
            // g3: '"module-name-03"'
            //
            // return 'const { export03 } = testA.named'
            match = match
              .replace(g3, `${importmap[key]}.named`)
            match = match.replace(reKeywordFROM, (ma, matchfrom) => (
              ma.replace(matchfrom, '=')))
          }
        }
        
        else if (!reSpacesANY.test(g2)) {
          // match: 'import defaultExport01 from "module-name-01"',
          // g1: 'import',
          // g2: 'defaultExport01',
          // g3: '"module-name-01"'
          // 
          // return 'const defaultExport01 = importmapKEY.default'
          match = match
            .replace(g3, `${importmap[key]}.all.default`)
          match = match.replace(reKeywordFROM, (ma, matchfrom) => (
            ma.replace(matchfrom, '=')))
        }

        else if (reGlobAS.test(g2)) {
          if (g2.startsWith('*') && reMIXEDGLOBBEDDEFAULT.test(g2)) {
            // match: 'import * as name10a, defaultExport10a from "module-name-10a";',
            // g1: 'import',
            // g2: '"module-name-10a"',
            // g3: 'defaultExport10a, * as name10a',
            //
            // return,
            // const defaultExport09a = testA.all.default
            // const name10a = testA.named;
            match = g2.replace(reMIXEDGLOBBEDDEFAULT, (m, h1, h2, h3, mnamed, mdefault) => {
              return [
                `const ${mdefault} = ${importmap[key]}.all.default`,
                `const ${mnamed} = ${importmap[key]}.named`
              ].join('\n')
            })

            return match          
          } else if (!g2.startsWith('*') && reMIXEDDEFAULTGLOBBED.test(g2)) {
            // match: 'import defaultExport10a, * as name10a from "module-name-10a";',
            // g1: 'import',
            // g2: 'defaultExport10a, * as name10a',
            // g3: '"module-name-10a"',
            //
            // return,
            // const defaultExport09a = testA.all.default
            // const name10a = testA.named;            
            match = g2.replace(reMIXEDDEFAULTGLOBBED, (m, mdefault, h2, h3, h4, mnamed) => {
              return [
                `const ${mdefault} = ${importmap[key]}.all.default`,
                `const ${mnamed} = ${importmap[key]}.named`
              ].join('\n')
            })

            return match
          } else {
            match = match
              .replace(reGlobAS, '')
            match = match
              .replace(g3, `${importmap[key]}.named`)
            match = match.replace(reKeywordFROM, (ma, matchfrom) => (
              ma.replace(matchfrom, '=')))
          }
        }

        return 'const' + match.slice(enumKeywordIMPORT.length)
      }

      // return match.replace(g3, `'${importmap[key]}'`)
    })
  }, jsstr)

  return jsstr
}
