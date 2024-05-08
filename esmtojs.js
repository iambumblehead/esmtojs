const enumKeywordIMPORT = 'import'
const enumKeywordEXPORT = 'export'

const reKeywordAS = /[ \t\n\r]as[ \t\n\r]/
const reKeywordFROM = /(?:[ \t\n\r])(from)(?:[ \t\n\r])/
const reSpacesANY = /[ \t\n\r]/
// const reGlobFROM = /[ \t\n\r]?\*[ \t\n\r]from[ \t\n\r]/
const reGlobAS = /[ \t\n\r]?\*[ \t\n\r](as)/
const reDEFAULTAS = /[ \t\n\r]?(default)[ \t\n\r](as)/
const reNAMEDAS = /[ \t\n\r]?([^ \t\n\r]*)[ \t\n\r](as)/
const reNAMEDASGROUP = /([^ \t\n\r]*)[ \t\n\r](as)[ \t\n\r]([^ \t\n\r]*)/
// const reMIXEDNAMEDDEFAULT = /({[^}*]})([ \t\n\r,]*)?(.*)/
// eslint-disable-next-line max-len
// const reMIXEDNAMEDDEFAULT = /([ \t\n\r,]*)?([ \t\n\r,]*)?({[^}*]})([ \t\n\r,]*)?([ \t\n\r,]*)?/
const reMIXEDDEFAULTNAMED = /^([^ \t\n\r,{]*)([ \t\n\r,]*)({[^}]*})/
const reMIXEDNAMEDDEFAULT = /^({[^}]*})([ \t\n\r,]*)([^ \t\n\r,}]*)/

// eslint-disable-next-line max-len
// const reMIXEDDEFAULTGLOBBED = /^([^ \t\n\r,{]*)([ \t\n\r,]*)( as[ \t\n\r,]*)([^ \t\n\r]*)/
// eslint-disable-next-line max-len
// const reMIXEDDEFAULTGLOBBED = /^([^ \t\n\r,{]*)([ \t\n\r,]*)(\*|{[^}]*})( as[ \t\n\r,]*)([^ \t\n\r]*)/
// eslint-disable-next-line max-len
const reMIXEDDEFAULTGLOBBED = /^([^ \t\n\r,{]*)([ \t\n\r,]*)(\*|{[^}]*})( as[ \t\n\r,]*)([^ \t\n\r]*)/
// eslint-disable-next-line max-len
// const reMIXEDDEFAULTGLOBBED = /^([\w]*)([ \t\n\r,]*)(\*|{[^}]*})( as[ \t\n\r,]*)([^ \t\n\r]*)/
// eslint-disable-next-line max-len
const reMIXEDGLOBBEDDEFAULT = /^([ \t\n\r,]*)(\*|{[^}]*})( as[ \t\n\r]*)([^,]*),[ \t\n\r,]?([^ \t\n\r]*)/

// https://github.com/flex-development/export-regex
const EXPORT_DECLARATION_REGEX = // eslint-disable-next-line
  /(?<=^|[\n;](?:[\t ]*(?:\w+ )?)?)export\s*(?<modifiers>(?:\s*declare|\s*abstract|\s*async)+)?\s*(?<declaration>class|const +enum|const|enum|function\*?|interface|let|namespace|type(?! *\{)|var)\s+(?<exports>(?:[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*(?=[\s=:;/({])(?!.*?,))|(?:[\w\t\n\r .,:$'"=-]+)|(?:[{[][\w\t\n\r .,:$'"-]+[}\]]))(?:\s*=\s*[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*)?/gu
const EXPORT_LIST_REGEX = // eslint-disable-next-line
  /(?<=^[\t ]*|[\n;](?:[\t ]*(?:\w+ )?)?)export(?:(?:\s+(?<type>type)\s*)|\s*)(?<exports>{[\w\t\n\r "$'*,./-]*?})(?=[\t\n ;](?!from)|$)/g
const EXPORT_AGGREGATE_REGEX = // eslint-disable-next-line
  /(?<=^[\t ]*|[\n;](?:[\t ]*(?:\w+ )?)?)export(?:(?: *(?<type>type) *)|[\t\n ]*)(?<exports>(?:\*(?: +as +\S+)?)|\S+|(?:{[\w\t\n\r "$'*,./-]+?}))[\t ]*from[\t ]*["']\s*(?<specifier>(?:(?<=' *)[^']*[^\s'](?= *'))|(?:(?<=" *)[^"]*[^\s"](?= *"))) *["']/g

const closuretpl = `let :name = (esmtojs => {
:filestr
:esmtojsexports
Object.assign(esmtojs.all, esmtojs.named)
})({all:{},named:{}})`

const reEmbedString = /('[^']*'|"[^"]*")/
const reLiteralLikeness = /^\w*:\w*$/
const parseWord = str => {
  // 'hello', "hello"
  const embstr = (str.match(reEmbedString) || [])[0]

  return embstr
    ? embstr
    : str.replace(/[^\w]/g, '')
}

// '{ variable1 as name1' => name1:variable1
const convertLikenessAsToLiteral = aspat => {
  // [ '{ variable1', 'name1' ]
  const namedef = aspat.split(reKeywordAS)
  // 'name1:variable1'
  return `${parseWord(namedef[1])}:${parseWord(namedef[0])}`
}

// ' name2 = 2' => name2
// ' name2: bar } => name2
// '{ name1', => name1
const convertLikenessDefToName = pat => (
  pat
    .replace(/([ \t\n\r]*)?[:=].*/, '')
    .replace(/[^\w]/g, '')
    .trim())

const declarationnamesparse = names => (
  // possible inaccuracies
  // strip everything that exists after '=' and before ',}'

  // namesre = /[^=]([ \t\n\r]*)?(\w*)([ \t\n\r]*)?=?/g,
  names.split(',').reduce((parsed, nregion) => {
    // ' name2 = 2' => name2
    // ' name2: bar } => name2
    // '{ name1', => name1
    const possiblename = (
      reKeywordAS.test(nregion)
        ? convertLikenessAsToLiteral(nregion)
        : convertLikenessDefToName(nregion))

    // if its not a word discard it
    if (/[^\w]/.test(possiblename) &&
        !reEmbedString.test(possiblename) &&
        !reLiteralLikeness.test(possiblename)) {
      return parsed
    }

    parsed.push(possiblename)

    return parsed
  }, []))

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

  const exports = []
  // Aggregating modules
  // export * from "module-name";
  // export * as name1 from "module-name";
  // export { name1, nameN } from "module-name";
  // export { import1 as name1, import2 as name2, nameN } from "module-name";
  // export { default, named } from "module-name";
  // export { default as name1 } from "module-name";
  jsstr = jsstr.replace(EXPORT_AGGREGATE_REGEX, (m, h1, expnames, mId) => {
    const moduleId = importmap[mId]
    
    // export * from "module-name";
    if (expnames === '*') {
      exports.push(`Object.assign(esmtojs.named, ${moduleId}.named)`)
    } else if (reGlobAS.test(expnames)) {
      const name = parseWord(expnames.replace(reGlobAS, ''))
      exports.push(`Object.assign(esmtojs.named, {${name}:${moduleId}.named})`)
    } else {
      declarationnamesparse(expnames).forEach(expname => {
        if (/:/.test(expname)) {
          const expnames = expname.split(':')
          const ns = expnames[0] === 'default' ? `all` : `named`
          const assign = `{${expnames[0]}:${moduleId}.all.${expnames[1]}}`

          exports.push(`Object.assign(esmtojs.${ns}, ${assign})`)
        } else {
          const ns = expname === 'default' ? `all` : `named`
          const assign = `{${expname}:${moduleId}.all.${expname}}`

          exports.push(`Object.assign(esmtojs.${ns}, ${assign})`)
        }
      })
    }

    return '0'
  })
  
  jsstr = Object.keys(importmap).reduce((str, key) => {    
    const re = buildImportReplaceRe(key)
    return str.replace(re, (match, g1, g2, g3) => {
      // 'optional use stringy or object',
      if (g1 === enumKeywordIMPORT) {
        if (String(g2).endsWith('}') && !String(g2).startsWith('{')) {
          // eslint-disable-next-line max-len
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
          // eslint-disable-next-line max-len
          // match: 'import defexp9 { export091, export092 }, defexp9 from "module-name-09"',
          // g1: 'import',
          // g2: 'defexp9, { export091, export092 }',
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
            // eslint-disable-next-line max-len
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
            // eslint-disable-next-line max-len
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
            // eslint-disable-next-line max-len
            // match: 'import * as name10a, defaultExport10a from "module-name-10a";',
            // g1: 'import',
            // g2: '"module-name-10a"',
            // g3: 'defaultExport10a, * as name10a',
            //
            // return,
            // const defaultExport09a = testA.all.default
            // const name10a = testA.named;
            // eslint-disable-next-line max-len
            match = g2.replace(reMIXEDGLOBBEDDEFAULT, (m, h1, h2, h3, mnamed, mdefault) => {
              return [
                `const ${mdefault} = ${importmap[key]}.all.default`,
                `const ${mnamed} = ${importmap[key]}.named`
              ].join('\n')
            })

            return match          
          } else if (!g2.startsWith('*') && reMIXEDDEFAULTGLOBBED.test(g2)) {
            // eslint-disable-next-line max-len
            // match: 'import defaultExport10a, * as name10a from "module-name-10a";',
            // g1: 'import',
            // g2: 'defaultExport10a, * as name10a',
            // g3: '"module-name-10a"',
            //
            // return,
            // const defaultExport09a = testA.all.default
            // const name10a = testA.named;
            // eslint-disable-next-line max-len
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
    })
  }, jsstr)
  
  jsstr = jsstr.replace(EXPORT_DECLARATION_REGEX, (m, h1, mdectype, mnames) => {
    const namesparsed = (mnames && !/[^\w]/.test(mnames))
      ? [mnames]
      : declarationnamesparse(mnames)

    m = m.slice(enumKeywordEXPORT.length + 1)
    exports.push(`Object.assign(esmtojs.named, {${namesparsed}})`)

    return m
  })

  jsstr = jsstr.replace(EXPORT_LIST_REGEX, (m, h1, mnames) => {
    const namesparsed = (mnames && !/[^\w]/.test(mnames))
      ? [mnames]
      : declarationnamesparse(mnames)

    exports.push(`Object.assign(esmtojs.named, {${namesparsed}})`)
    
    return '0'
  })

  jsstr = jsstr.replace(/:esmtojsexports/, (
    exports.length
      ? exports.join('\n')
      : ''))

  return jsstr
}
