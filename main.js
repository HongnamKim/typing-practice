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
  quoteDisplay.innerText = "";
  quoteInput.value = null;

  const quoteIndex = Math.floor(Math.random() * krs.length);
  const quote = krs[quoteIndex][0];
  quoteLength = quote.length;
  console.log(quoteLength);

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
  if (!timerSet) {
    return;
  } else {
    startTime = new Date();
    timerInterval = setInterval(getTimerTime, 100);
  }
};

const getTimerTime = () => {
  currentTime = (new Date() - startTime) / 1000;
  timer.innerText = currentTime;
};

let correct = true;

const onInputChange = (event) => {
  timerStart(timerSet);
  timerSet = false;

  const arrayQuote = quoteDisplay.querySelectorAll("span");
  let userInput = event.target.value.split("");
  userInput.pop();
  arrayQuote.forEach((characterSpan, index) => {
    const character = userInput[index];
    //input이 되지 않은 부분은 검은 글씨
    if (character == null) {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("incorrect");
      characterSpan.classList.add("none");
      correct = false;
    }
    //input 되고, 올바르게 입력
    else if (character === characterSpan.innerText) {
      characterSpan.classList.add("correct");
      characterSpan.classList.remove("none");
      characterSpan.classList.remove("incorrect");
      correct = true;
    }
    //input 되고, 틀렸을 때
    else {
      characterSpan.classList.remove("correct");
      characterSpan.classList.remove("none");
      characterSpan.classList.add("incorrect");
      correct = false;
    }
  });
  if (correct) {
    //타이머 정지
    clearInterval(timerInterval);
    //WPM 계산해서 화면에 출력
    typingWpm = quoteLength / (currentTime / 60);
    wpmList.push(typingWpm);
    console.log(currentTime);
    console.log(wpmList);
    //ACC 계산해서 화면에 출력
    timerSet = true;
    typingCnt++;
    infoCnt.innerText = `Count : ${typingCnt}`;
    timer.innerText = "0";
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
