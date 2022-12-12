//krs = sentence.js에 있는 문장 모음

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

let typingWpm,
  typingAcc,
  typingCnt = 0;

let wpmList = [];
let accList = [];

//0 = easy, 1 = normal, 2 = hard
let accDifficulty = 0;
let wpmDifficulty = 0;

let quoteLength = 0;

let loadQuote = () => {
  correct = false;
  quoteDisplay.innerText = "";
  quoteInput.value = null;

  const quoteIndex = Math.floor(Math.random() * krs.length);
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
  timer.innerText = currentTime;
};

const clearTimerTime = () => {
  clearInterval(timerInterval);
  timerSet = true;
  timer.innerText = "0";
};

let correct = false;
let totalChar = 0;
let currentChar = 0;
let currentLength = 0;

const onInputChange = (event) => {
  //타이머 시작
  timerStart(timerSet);
  //타이머 리셋 방지
  timerSet = false;

  //주어진 문장 span element Array
  const arrayQuote = quoteDisplay.querySelectorAll("span");
  //입력 문장 글자별 분리
  let userInput = event.target.value.split("");

  if (userInput.length === 0) {
    clearTimerTime();
  }
  /*
  currentChar++;
  if (userInput.length > currentLength) {
    totalChar += currentChar;
    currentChar = 0;
    currentLength++;
  }
  console.log(currentChar, totalChar);
  */

  for (let i = 0; i < arrayQuote.length; i++) {
    if (i === userInput.length - 1) {
      //글 수정으로 인해 이미 정답처리 되었던 글자가 마지막 글자가 된 경우 확인 패스
      //classlist에 correct가 있으면 continue 없으면 정답체크하도록
      if (Array.from(arrayQuote[i].classList).includes("correct")) {
        continue;
      } else {
        arrayQuote[i].classList.remove("correct");
        arrayQuote[i].classList.remove("incorrect");
        arrayQuote[i].classList.add("none");
        correct = false;
        continue;
      }
    }
    const character = userInput[i];

    if (character == null) {
      arrayQuote[i].classList.remove("correct");
      arrayQuote[i].classList.remove("incorrect");
      arrayQuote[i].classList.add("none");
      correct = false;
    } else if (character === arrayQuote[i].innerText) {
      arrayQuote[i].classList.remove("incorrect");
      arrayQuote[i].classList.remove("none");
      arrayQuote[i].classList.add("correct");
      correct = true;
    } else {
      arrayQuote[i].classList.remove("correct");
      arrayQuote[i].classList.remove("none");
      arrayQuote[i].classList.add("incorrect");
      correct = false;
    }
  }
  if (correct) {
    //타이머 정지
    clearTimerTime();
    //WPM 계산해서 화면에 출력
    typingWpm = quoteLength / (currentTime / 60);
    wpmList.push(typingWpm);
    console.log(wpmList);
    //ACC 계산해서 화면에 출력
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

quoteInput.addEventListener("input", onInputChange);

accEasy.addEventListener("click", onAccEasyClick);
accNormal.addEventListener("click", onAccNormalClick);
accHard.addEventListener("click", onAccHardClick);

wpmEasy.addEventListener("click", onWpmEasyClick);
wpmNormal.addEventListener("click", onWpmNormalClick);
wpmHard.addEventListener("click", onWpmHardClick);
