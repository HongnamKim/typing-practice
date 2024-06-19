const sum = (list) => {
  let result = 0;
  list.forEach((item) => {
    result += item;
  });
  return result;
};

const average = (list) => {
  return sum(list) / list.length;
};

const max = (list) => {
  let maxValue = 0;
  list.forEach((item) => {
    if (item > maxValue) {
      maxValue = item;
    }
  });

  return maxValue;
};

const koreanSeparator = (character) => {
  const koreanStart = 44032;
  const koreanEnd = 55203;

  const charCode = character.charCodeAt(0);

  //숫자 or 영어는 그대로 반환
  if (charCode < koreanStart || charCode > koreanEnd) {
    return [character];
  }₩

  const relativeCode = charCode - koreanStart;

  const firstIndex = parseInt(relativeCode / 588);
  const midIndex = parseInt((relativeCode - firstIndex * 588) / 28);
  const lastIndex = parseInt(relativeCode % 28);

  if (lastChar[lastIndex]) {
    return [firstChar[firstIndex], midChar[midIndex], lastChar[lastIndex]];
  }
  return [firstChar[firstIndex], midChar[midIndex]];
};
