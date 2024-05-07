const closuretpl = `let :name = (esmtojs => {
:filestr
})({})`

export default (esmstr, name, spec, jsstr) => {
  jsstr = closuretpl
    .replace(/:name/, name)
    .replace(/:filestr/, esmstr)


  jsstr = jsstr.replace(
    /export default/g, 'esmtojs =')
  
  return jsstr
}
