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

//0 = easy, 1 = normal, 2 = hard
let accDifficulty = 0;
let wpmDifficulty = 0;

let loadQuote = () => {
  quoteDisplay.innerText = "";
  quoteInput.value = null;

  const quoteIndex = Math.floor(Math.random() * krs.length);
  const quote = krs[quoteIndex][0];

  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.classList.add("none");
    characterSpan.innerText = character;
    quoteDisplay.appendChild(characterSpan);
  });

  quoteAuthor.innerText = krs[quoteIndex][1];

  return quoteIndex;
};

let correct = true;
let timerSet = true;
let startTime;

let timerStart = (timerSet) => {
  startTime = new Date();
  if (timerSet) {
    setInterval(() => {
      timer.innerText = getTimerTime();
    }, 1000);
  } else {
    return;
  }
};

function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000);
}

let onInputChange = (event) => {
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
    //input 되고, 올바르게 입력했는지 확인
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
    //타이머 재시작되도록 key 설정
    //WPM 계산해서 화면에 출력
    //ACC 계산해서 화면에 출력
    typingCnt++;
    infoCnt.innerText = `Count : ${typingCnt}`;
    loadQuote();
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
