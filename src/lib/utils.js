export const isEqualSet = (setA, setB) => {
  if (setA.size !== setB.size) return false;
  for (let el of setA) if (!setB.has(el)) return false;
  return true;
};
