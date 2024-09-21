export const cm2px = (size) => {
  const magnification = 120
  let num = size * magnification
  return num
}

export const setConfig = (storeConfig, targetConfig) => {
  for (const key in storeConfig) {
    targetConfig[key] = storeConfig[key]
  }
}

export const rgbStr2Rgba = (rgbStr) => {
  const [r, g, b, a] = rgbStr.slice(rgbStr.indexOf('(') + 1, rgbStr.lastIndexOf(')')).split(',')

  return {
    r: parseInt(r),
    g: parseInt(g),
    b: parseInt(b),
    a: parseInt(a)
  }
}
