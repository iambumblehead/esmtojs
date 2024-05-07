const closuretpl = `let :name = (esmtojs => {
:filestr
})({})`

export const buildImportReplaceRe = key => (
  key = key.replace('/', '\\/').replace('.', '\\.'),
  // '$' dollar sign used in immutable.js import variable name :(
  // '/' comment slash used in comments inside import expression
  new RegExp(
    '(import|export)' + // dollar sign used in immutable.js
      // `(?:[\\s.*]([\\w*{}\n\r\t, /$]+)[\\s*]from)?[\\s*](?:(["']${key}["']))`,
      `(?:[\\s.*]([\\w*{}\n\r\t,"' /$]+)[\\s*]from)?[\\s*](?:(["']${key}["']))`,
    'gm'))

export default (esmstr, name, importmap, jsstr) => {
  jsstr = closuretpl
    .replace(/:name/, name)
    .replace(/:filestr/, esmstr)


  jsstr = jsstr.replace(
    /export default/g, 'esmtojs =')


  jsstr = Object.keys(importmap).reduce((str, key) => {
      const re = buildImportReplaceRe(key)

    //console.log('re', re, String(str).match(re))
      return str.replace(re, (match, g1, g2, g4) => (
        match.replace(g4, `'${importmap[key]}'`)))
    }, jsstr)

  return jsstr
}
