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
