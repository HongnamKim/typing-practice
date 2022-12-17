"use strict";

const timer = document.getElementById("timer");
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteInput = document.getElementById("quoteInput");

const accEasy = document.getElementById("accEasy");
const accNormal = document.getElementById("accNormal");
const accHard = document.getElementById("accHard");

const wpmEasy = document.getElementById("wpmEasy");
const wpmNormal = document.getElementById("wpmNormal");
const wpmHard = document.getElementById("wpmHard");

const infoWpm = document.getElementById("wpm");
const infoAcc = document.getElementById("acc");
const infoCnt = document.getElementById("cnt");

let wpmList = [];
let cpmList = [];
let accList = [];

//0 = easy, 1 = normal, 2 = hard
let accDifficulty = 0;
let wpmDifficulty = 0;

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

const koreanSeparator = (character) => {
  const koreanStart = 44032;
  const koreanEnd = 55203;

  const charCode = character.charCodeAt(0);

  //숫자 or 영어는 그대로 반환
  if (charCode < koreanStart || charCode > koreanEnd) {
    return [character];
  }

  const relativeCode = charCode - koreanStart;

  const firstIndex = parseInt(relativeCode / 588);
  const midIndex = parseInt((relativeCode - firstIndex * 588) / 28);
  const lastIndex = parseInt(relativeCode % 28);

  if (lastChar[lastIndex]) {
    return [firstChar[firstIndex], midChar[midIndex], lastChar[lastIndex]];
  }
  return [firstChar[firstIndex], midChar[midIndex]];
};

const clearTypingVariables = () => {
  typedArray = [];
  typedCharCount = [];
  correctCnt = 0;
  incorrectCnt = 0;
};

let quoteLength = 0;
let quoteArray = [];

let loadQuote = () => {
  const quoteIndex = Math.floor(Math.random() * krs.length);
  const quote = krs[quoteIndex][0];
  quoteLength = quote.length;

  quoteDisplay.innerText = "";
  quoteInput.value = null;

  clearTypingVariables();

  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.classList.add("none");
    characterSpan.innerText = character;
    quoteArray.push(koreanSeparator(character));
    quoteDisplay.appendChild(characterSpan);
  });

  quoteAuthor.innerText = `-${krs[quoteIndex][1]}-`;
};

let speedCheckSet = true;
let speedInterval;
let startTime;
let currentTime;

const speedCheckStart = (speedCheckSet) => {
  if (speedCheckSet) {
    startTime = new Date();
    speedInterval = setInterval(getSpeed, 100);
  } else {
    return;
  }
};

const getSpeed = () => {
  currentTime = (new Date() - startTime) / 1000;
  //timer.innerText = currentTime;
  timer.innerText = (sum(typedCharCount) * 60) / currentTime;
};

const clearSpeedCheck = () => {
  clearInterval(speedInterval);
  speedCheckSet = true;
  timer.innerText = "0";
};

const onESC = (event) => {
  if (event.keyCode === 27) {
    clearSpeedCheck();
    quoteInput.value = null;
    clearTypingVariables();

    const arrayQuote = quoteDisplay.querySelectorAll("span");
    arrayQuote.forEach((quoteCharacter) => {
      quoteCharacter.classList.remove("correct");
      quoteCharacter.classList.remove("incorrect");
      quoteCharacter.classList.add("none");
    });
  }
};

let typedQuoteCnt = 0;

let correctCnt = 0;
let incorrectCnt = 0;

let typedCharCount = [];
let typedArray = [];

const onInputChange = (event) => {
  //타이머 시작
  speedCheckStart(speedCheckSet);
  speedCheckSet = false;

  //주어진 문장 span element Array
  const arrayQuote = quoteDisplay.querySelectorAll("span");
  let userInput = event.target.value.split("");

  //입력값 자모 분리
  for (let i = 0; i < userInput.length; i++) {
    typedArray[i] = koreanSeparator(userInput[i]);
  }

  //수정하여 글을 지웠을 경우, 지운 글자의 자모 array 지우기
  typedArray.splice(userInput.length, quoteLength);

  //글자별 타이핑 횟수 계산
  for (let i = 0; i < typedArray.length; i++) {
    typedCharCount[i] = typedArray[i].length;
  }

  //수정하여 글을 지웠을 경우, 지운 글자의 타이핑 횟수 지우기
  typedCharCount.splice(userInput.length, quoteLength);

  //사용자가 모든 값을 지웠을 경우 초기화
  if (userInput.length === 0) {
    clearSpeedCheck();
    clearTypingVariables();
  }

  const checklength = userInput.length - 1;
  for (let i = 0; i < checklength; i++) {
    if (
      Array.from(arrayQuote[i].classList).includes("correct") ||
      Array.from(arrayQuote[i].classList).includes("incorrect")
    ) {
      continue;
    }
    if (userInput[i] === arrayQuote[i].innerText) {
      arrayQuote[i].classList.remove("none");
      arrayQuote[i].classList.add("correct");
      correctCnt++;
    } else {
      arrayQuote[i].classList.remove("none");
      arrayQuote[i].classList.add("incorrect");
      incorrectCnt++;
    }
  }

  //미입력 글자 none 처리
  for (let i = userInput.length; i < arrayQuote.length; i++) {
    arrayQuote[i].classList.remove("correct");
    arrayQuote[i].classList.remove("incorrect");
    arrayQuote[i].classList.add("none");
  }

  //입력 완료 시 속도, 정확도 계산 후 다음 문장 출력
  if (quoteLength < userInput.length) {
    console.log(typedArray);
    clearSpeedCheck();

    const typingWpm = quoteLength / (currentTime / 60);
    const typingCpm = sum(typedCharCount) / (currentTime / 60);
    wpmList.push(typingWpm);
    cpmList.push(typingCpm);
    console.log(`average speed ${average(cpmList)}`);

    const typingAcc = (correctCnt / (correctCnt + incorrectCnt)) * 100;
    accList.push(typingAcc);
    console.log(`quote length: ${quoteLength}`);
    console.log(correctCnt, incorrectCnt);
    console.log(typingAcc);

    typedQuoteCnt++;
    infoCnt.innerText = `Count : ${typedQuoteCnt}`;

    loadQuote();
  }
};

loadQuote();

function onAccEasyClick() {
  accDifficulty = 0;
}

function onAccNormalClick() {
  accDifficulty = 1;
}

function onAccHardClick() {
  accDifficulty = 2;
}

function onWpmEasyClick() {
  wpmDifficulty = 0;
}

function onWpmNormalClick() {
  wpmDifficulty = 1;
}

function onWpmHardClick() {
  wpmDifficulty = 2;
}

quoteInput.addEventListener("keydown", onESC);

quoteInput.addEventListener("input", onInputChange);

accEasy.addEventListener("click", onAccEasyClick);
accNormal.addEventListener("click", onAccNormalClick);
accHard.addEventListener("click", onAccHardClick);

wpmEasy.addEventListener("click", onWpmEasyClick);
wpmNormal.addEventListener("click", onWpmNormalClick);
wpmHard.addEventListener("click", onWpmHardClick);
