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

let quoteLength = 0;

let loadQuote = () => {
  correct = false;
  quoteDisplay.innerText = "";
  quoteInput.value = null;

  typedChar = 0;
  correctCnt = 0;
  incorrectCnt = 0;

  const quoteIndex = Math.floor(Math.random() * krs.length);
  //krs = sentence.js에 있는 문장 모음
  const quote = krs[quoteIndex][0];
  quoteLength = quote.length;

  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.classList.add("none");
    characterSpan.innerText = character;
    quoteDisplay.appendChild(characterSpan);
  });

  quoteAuthor.innerText = `-${krs[quoteIndex][1]}-`;

  return quoteIndex;
};

let timerSet = true;
let startTime;
let currentTime;
let timerInterval;

const timerStart = (timerSet) => {
  if (timerSet) {
    startTime = new Date();
    timerInterval = setInterval(getTimerTime, 100);
  } else {
    return;
  }
};

const getTimerTime = () => {
  currentTime = (new Date() - startTime) / 1000;
  //timer.innerText = currentTime;
  timer.innerText = (typedChar * 60) / currentTime;
};

const clearTimerTime = () => {
  clearInterval(timerInterval);
  timerSet = true;
  timer.innerText = "0";
};

const average = (list) => {
  let sum = 0;
  list.forEach((item) => {
    sum += item;
  });
  return sum / list.length;
};

let correct = false;

const onESC = (event) => {
  if (event.keyCode === 27) {
    clearTimerTime();
    quoteInput.value = null;
    correctCnt = 0;
    incorrectCnt = 0;
    typedChar = 0;

    const arrayQuote = quoteDisplay.querySelectorAll("span");
    arrayQuote.forEach((quoteChar) => {
      quoteChar.classList.remove("correct");
      quoteChar.classList.remove("incorrect");
      quoteChar.classList.add("none");
    });
  }
};

let typingCnt = 0;

let correctCnt = 0;
let incorrectCnt = 0;

let typedChar = 0;

const onInputChange = (event) => {
  //타이머 시작
  timerStart(timerSet);
  timerSet = false;

  //주어진 문장 span element Array
  const arrayQuote = quoteDisplay.querySelectorAll("span");
  let userInput = event.target.value.split("");

  if (userInput[userInput.length - 1] !== " ") {
    typedChar++;
  }

  if (userInput.length === 0) {
    clearTimerTime();
    correctCnt = 0;
    incorrectCnt = 0;
    typedChar = 0;
  }

  let checklength = userInput.length - 1;
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
      correct = true;
    } else {
      arrayQuote[i].classList.remove("none");
      arrayQuote[i].classList.add("incorrect");
      incorrectCnt++;
      correct = false;
    }
  }

  //미입력 글자 none 처리
  for (let i = userInput.length; i < arrayQuote.length; i++) {
    arrayQuote[i].classList.remove("correct");
    arrayQuote[i].classList.remove("incorrect");
    arrayQuote[i].classList.add("none");
    correct = false;
  }

  //입력 완료 시 속도, 정확도 계산 후 다음 문장 출력
  if (quoteLength < userInput.length) {
    clearTimerTime();

    const typingWpm = quoteLength / (currentTime / 60);
    const typingCpm = typedChar / (currentTime / 60);
    wpmList.push(typingWpm);
    cpmList.push(typingCpm);
    console.log(`average speed ${average(cpmList)}`);

    const typingAcc = (correctCnt / (correctCnt + incorrectCnt)) * 100;
    accList.push(typingAcc);
    console.log(`quote length: ${quoteLength}`);
    console.log(correctCnt, incorrectCnt);
    console.log(typingAcc);

    typingCnt++;
    infoCnt.innerText = `Count : ${typingCnt}`;

    nowIndex = loadQuote();
  }
};

let nowIndex = loadQuote();

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
