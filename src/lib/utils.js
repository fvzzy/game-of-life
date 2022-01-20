export const isEqualSet = (setA, setB) => {
  if (setA.size !== setB.size) return false;
  for (let el of setA) if (!setB.has(el)) return false;
  return true;
};

const hexStrToRgb = (hexStr) => {
  return hexStr
    .substring(1) // assume leading `#`
    .match(/.{2}/g)
    .map((code) => parseInt(code, 16));
};

const rgbToHexStr = (rgbVals) => {
  return rgbVals.reduce(
    (hexStr, val) => hexStr + val.toString(16).padStart(2, 0),
    "#"
  );
};

export const blendHexColours = (...hexColors) => {
  const hexColorsToRgbTotal = hexColors.reduce(
    (result, hexColor) => {
      return hexStrToRgb(hexColor).map(
        (rgbLayerVal, i) => rgbLayerVal + result[i]
      );
    },
    [0, 0, 0]
  );

  const averageRgbValues = hexColorsToRgbTotal.map((v) =>
    Math.round(v / hexColors.length)
  );

  return rgbToHexStr(averageRgbValues);
};

const randomRgbVal = () => Math.floor(Math.random() * 256);

export const randomHexColor = () =>
  rgbToHexStr([randomRgbVal(), randomRgbVal(), randomRgbVal()]);
