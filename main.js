"use strict";

const speedCheck = document.getElementById("speedCheck");
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteInput = document.getElementById("quoteInput");

const currentCpm = document.getElementById("currentCPM");
const currentCpmText = document.getElementById("speed-check-text");

const infoCpm = document.getElementById("cpm");
const infoAcc = document.getElementById("acc");
const infoCnt = document.getElementById("cnt");

const contact = document.getElementById("contact");

contact.textContent = "Contact - ghdskawkd@naver.com";

const wpmList = [];
const cpmList = [];
const accList = [];

const clearTypingVariables = () => {
  typedArray = [];
  typedCharCount = [];
  correctCnt = 0;
  incorrectCnt = 0;
  quoteInput.rows = 1;
  initialInputHeight = quoteInput.scrollHeight;
};

let quoteLength = 0;
let quoteArray = [];

const loadQuote = () => {
  const quoteIndex = Math.floor(Math.random() * sentences.length);
  const quote = sentences[quoteIndex][0];
  //quoteInput.placeholder = quote;
  quoteLength = quote.length;

  quoteDisplay.innerText = "";
  quoteInput.value = null;

  clearTypingVariables();

  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.classList.add("none");
    if (darkModeButton.checked) {
      characterSpan.classList.add("dark");
    }

    characterSpan.innerText = character;
    quoteArray.push(koreanSeparator(character));
    quoteDisplay.appendChild(characterSpan);
  });

  quoteAuthor.innerText = `-${sentences[quoteIndex][1]}-`;
};

let speedCheckSet = true;
let speedInterval;
let showCurrentCpm = currentCpm.checked;
let startTime;
let currentTime;

const speedCheckStart = (speedCheckSet) => {
  if (!speedCheckSet) {
    return;
  }

  startTime = new Date();
  speedInterval = setInterval(getSpeed, 100);
};

const getSpeed = () => {
  currentTime = (new Date() - startTime) / 1000;
  //speedCheck.innerText = currentTime;

  if (!showCurrentCpm) {
    return;
  }
  speedCheck.innerText = Math.round((sum(typedCharCount) * 60) / currentTime);
};

const clearSpeedCheck = () => {
  clearInterval(speedInterval);
  speedCheckSet = true;
  speedCheck.innerText = "0";
};

const onKeyDown = (event) => {
  // 방향키 입력
  if (37 <= event.keyCode && event.keyCode <= 40) {
    loadQuote();
    return;
  }

  // ESC 입력
  if (event.keyCode === 27) {
    clearSpeedCheck();
    quoteInput.value = null;
    clearTypingVariables();

    const arrayQuote = quoteDisplay.querySelectorAll("span");
    arrayQuote.forEach((quoteCharacter) => {
      quoteCharacter.classList.remove("correct");
      quoteCharacter.classList.remove("incorrect");
      quoteCharacter.classList.add("none");
      if (darkModeButton.checked) {
        arrayQuote[i].classList.add("dark");
      }
    });
  }
};

let typedQuoteCnt = 0;

let correctCnt = 0;
let incorrectCnt = 0;

let typedCharCount = [];
let typedArray = [];

let initialInputHeight = quoteInput.scrollHeight;

const onInputChange = (event) => {
  // textarea row 변경
  if (quoteInput.scrollHeight > initialInputHeight) {
    initialInputHeight = quoteInput.scrollHeight;
    quoteInput.rows++;
  }

  //타이머 시작
  speedCheckStart(speedCheckSet);
  speedCheckSet = false;

  //주어진 문장 span element Array
  const arrayQuote = quoteDisplay.querySelectorAll("span");
  const userInput = event.target.value.split("");

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

      if (darkModeButton.checked) {
        arrayQuote[i].classList.remove("dark");
      }

      arrayQuote[i].classList.add("correct");

      if (darkModeButton.checked) {
        arrayQuote[i].classList.add("dark");
      }

      correctCnt++;
    } else {
      arrayQuote[i].classList.remove("none");
      if (darkModeButton.checked) {
        arrayQuote[i].classList.remove("dark");
      }
      arrayQuote[i].classList.add("incorrect");
      if (darkModeButton.checked) {
        arrayQuote[i].classList.add("dark");
      }
      // console.log("wrong");
      // console.log(typedCharCount[i]);
      incorrectCnt++;
    }
  }

  //미입력 글자 none 처리
  for (let i = userInput.length; i < arrayQuote.length; i++) {
    arrayQuote[i].classList.remove("correct");
    arrayQuote[i].classList.remove("incorrect");
    arrayQuote[i].classList.add("none");
    if (darkModeButton.checked) {
      arrayQuote[i].classList.add("dark");
    }
  }

  //입력 완료 시 속도, 정확도 계산 후 다음 문장 출력
  if (quoteLength < userInput.length) {
    clearSpeedCheck();

    const typingWpm = quoteLength / (currentTime / 60);
    const typingCpm = sum(typedCharCount) / (currentTime / 60);
    wpmList.push(typingWpm);
    cpmList.push(typingCpm);
    // console.log(`average speed ${average(cpmList)}`);

    speedCheck.textContent = Math.round(typingCpm);
    infoCpm.textContent = `${Math.round(average(cpmList))}`;

    const typingAcc = (correctCnt / (correctCnt + incorrectCnt)) * 100;
    accList.push(typingAcc);
    //console.log(`quote length: ${quoteLength}`);
    //console.log(correctCnt, incorrectCnt);
    //console.log(typingAcc);
    infoAcc.textContent = `${Math.round(average(accList))}`;

    typedQuoteCnt++;
    infoCnt.innerText = `${typedQuoteCnt}`;

    quoteInput.rows = 1;
    loadQuote();
  } else if (userInput[userInput.length - 1] === "\n") {
    event.target.value = event.target.value.slice(
      0,
      event.target.value.length - 1
    );
  }
};

loadQuote();

const c = () => {
  showCurrentCpm = !showCurrentCpm;

  if (showCurrentCpm) {
    currentCpmText.textContent = "Current CPM";
  } else {
    currentCpmText.textContent = "Last CPM";
  }
};

currentCpm.addEventListener("change", c);

quoteInput.addEventListener("keydown", onKeyDown);

quoteInput.addEventListener("input", onInputChange);

// const accEasy = document.getElementById("accEasy");
// const accNormal = document.getElementById("accNormal");
// const accHard = document.getElementById("accHard");

// const wpmEasy = document.getElementById("wpmEasy");
// const wpmNormal = document.getElementById("wpmNormal");
// const wpmHard = document.getElementById("wpmHard");

//0 = easy, 1 = normal, 2 = hard
//let accDifficulty = 0;
//let wpmDifficulty = 0;

// function onAccEasyClick() {
//   accDifficulty = 0;
// }
// function onAccNormalClick() {
//   accDifficulty = 1;
// }
// function onAccHardClick() {
//   accDifficulty = 2;
// }
// function onWpmEasyClick() {
//   wpmDifficulty = 0;
// }
// function onWpmNormalClick() {
//   wpmDifficulty = 1;
// }
// function onWpmHardClick() {
//   wpmDifficulty = 2;
// }

// accEasy.addEventListener("click", onAccEasyClick);
// accNormal.addEventListener("click", onAccNormalClick);
// accHard.addEventListener("click", onAccHardClick);

// wpmEasy.addEventListener("click", onWpmEasyClick);
// wpmNormal.addEventListener("click", onWpmNormalClick);
// wpmHard.addEventListener("click", onWpmHardClick);
