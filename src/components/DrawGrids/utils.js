"use strict";
function utilsJs() {
  const perUnit = 96/2.54
  const magnification = 120;
  const cm2px = (size) => {
    let num = size * magnification;
    return num;
  }
  return { cm2px};
}

export default utilsJs;
