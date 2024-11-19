import { firstChar, lastChar, midChar } from "../const/korean-char.const";

export const koreanSeparator = (character) => {
  const koreanStart = 44032;
  const koreanEnd = 55203;

  const charCode = character.charCodeAt(0);

  //숫자 or 영어는 그대로 반환
  if (charCode < koreanStart || charCode > koreanEnd) {
    return [character];
  }

  const relativeCode = charCode - koreanStart;

  const firstIndex = Math.floor(relativeCode / 588);
  const midIndex = Math.floor((relativeCode - firstIndex * 588) / 28);
  const lastIndex = Math.floor(relativeCode % 28);

  if (lastChar[lastIndex]) {
    return [
      firstChar[firstIndex],
      ...separateMidChar(midIndex),
      ...separateLastChar(lastIndex),
    ];
  }
  return [firstChar[firstIndex], ...separateMidChar(midIndex)];
};

const separateMidChar = (midIndex) => {
  switch (midIndex) {
    case 9: //
      return ["ㅗ", "ㅏ"];

    case 10:
      return ["ㅗ", "ㅐ"];

    case 11:
      return ["ㅗ", "ㅣ"];
    case 14:
      return ["ㅜ", "ㅓ"];

    case 15:
      return ["ㅜ", "ㅔ"];
    case 16:
      return ["ㅜ", "ㅣ"];
    case 19:
      return ["ㅡ", "ㅣ"];

    default:
      return midChar[midIndex];
  }
};

const separateLastChar = (lastIndex) => {
  switch (lastIndex) {
    case 3:
      return ["ㄱ", "ㅅ"];
    case 5:
      return ["ㄴ", "ㅈ"];
    case 6:
      return ["ㄴ", "ㅎ"];
    case 9:
      return ["ㄹ", "ㄱ"];
    case 10:
      return ["ㄹ", "ㅁ"];
    case 11:
      return ["ㄹ", "ㅂ"];
    case 12:
      return ["ㄹ", "ㅅ"];
    case 13:
      return ["ㄹ", "ㅌ"];
    case 14:
      return ["ㄹ", "ㅍ"];
    case 15:
      return ["ㄹ", "ㅎ"];
    case 18:
      return ["ㅂ", "ㅅ"];
    default:
      return lastChar[lastIndex];
  }
};
