"use strict";

const speedCheck = document.getElementById("speedCheck");
const maxSpeed = document.getElementById("maxSpeed");
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteAuthor = document.getElementById("quoteAuthor");
const quoteInput = document.getElementById("quoteInput");

const currentCpm = document.getElementById("currentCPM");
const currentCpmText = document.getElementById("speed-check-text");

const resultPeriodDown = document.getElementById("result-period-btn-down");
const resultPeriodUp = document.getElementById("result-period-btn-up");
const resultPeriodValue = document.getElementById("result-period-value");

const infoCpm = document.getElementById("cpm");
const infoAcc = document.getElementById("acc");
const infoCnt = document.getElementById("cnt");

const contact = document.getElementById("contact");

contact.textContent = "Contact - 카카오톡 오픈 프로필";
contact.setAttribute("href", "https://open.kakao.com/o/sMHDrAog");

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

const shuffledSentences = sentences.sort(() => Math.random() - 0.5);

let shuffledSentencesIndex = Math.floor(
  Math.random() * shuffledSentences.length
);

const loadQuote = (arrowInput) => {
  // 방향키 입력
  if (arrowInput) {
    if (arrowInput > 38) {
      shuffledSentencesIndex++;
    } else {
      shuffledSentencesIndex--;
    }
  }

  //const quoteIndex = Math.floor(Math.random() * sentences.length);
  //const quote = sentences[quoteIndex][0];
  const quote = shuffledSentences[shuffledSentencesIndex][0];
  quoteLength = quote.length;

  quoteDisplay.innerText = "";
  quoteInput.value = null;

  clearTypingVariables();

  quote.split("").forEach((character) => {
    const characterSpan = document.createElement("span");
    characterSpan.classList.add("none");
    if (isDarkMode) {
      characterSpan.classList.add("dark");
    }

    characterSpan.innerText = character;
    quoteArray.push(koreanSeparator(character));
    quoteDisplay.appendChild(characterSpan);
  });

  quoteAuthor.innerText = `-${shuffledSentences[shuffledSentencesIndex][1]}-`;
};

let speedCheckSet = true;
let speedInterval;
let showCurrentCpm;
let startTime;
let currentTime;

const checkCurrentCpmConfig = () => {
  const storageCurrentCpm = storage.getItem(Storage_Current_Cpm);

  // 기존 설정 값 없을 경우
  if (storageCurrentCpm === null) {
    showCurrentCpm = true;
    storage.setItem(Storage_Current_Cpm, "true");
  } else {
    // 기존 설정 값 있을 경우
    showCurrentCpm = storageCurrentCpm === "true";
    currentCpm.checked = showCurrentCpm;

    currentCpmText.textContent = showCurrentCpm ? "Current CPM" : "Last CPM";
  }
};

checkCurrentCpmConfig();

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
    // 위 : 38
    // 아래 : 40
    // 좌 : 37
    // 우 : 39

    loadQuote(event.keyCode);
    return;
  }

  // ESC 입력
  if (event.keyCode === 27) {
    if (showPopUp) {
      closePopUp();
      return;
    }

    clearSpeedCheck();
    quoteInput.value = null;
    clearTypingVariables();

    const arrayQuote = quoteDisplay.querySelectorAll("span");
    arrayQuote.forEach((quoteCharacter) => {
      quoteCharacter.classList.remove("correct");
      quoteCharacter.classList.remove("incorrect");
      quoteCharacter.classList.add("none");
      if (isDarkMode) {
        quoteCharacter.classList.add("dark");
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
  // 팝업 노출 시 input 받지 않음
  if (showPopUp) {
    return;
  }

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

      if (isDarkMode) {
        arrayQuote[i].classList.remove("dark");
      }

      arrayQuote[i].classList.add("correct");

      if (isDarkMode) {
        arrayQuote[i].classList.add("dark");
      }

      correctCnt++;
    } else {
      arrayQuote[i].classList.remove("none");
      if (isDarkMode) {
        arrayQuote[i].classList.remove("dark");
      }
      arrayQuote[i].classList.add("incorrect");
      if (isDarkMode) {
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
    if (isDarkMode) {
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

    maxSpeed.textContent = `${Math.round(max(cpmList))}`;

    const typingAcc = (correctCnt / (correctCnt + incorrectCnt)) * 100;
    accList.push(typingAcc);
    //console.log(`quote length: ${quoteLength}`);
    //console.log(correctCnt, incorrectCnt);
    //console.log(typingAcc);
    infoAcc.textContent = `${Math.round(average(accList))}`;

    typedQuoteCnt++;
    infoCnt.innerText = `${typedQuoteCnt}`;

    quoteInput.rows = 1;
    shuffledSentencesIndex++;
    loadQuote();

    if (resultPeriodIndex === resultPeriods.length - 1) {
      return;
    }

    // result 주기에 도달
    if (typedQuoteCnt % resultPeriods[resultPeriodIndex] === 0) {
      const resultCpm = cpmList.slice(
        cpmList.length - resultPeriods[resultPeriodIndex]
      );
      const resultAcc = accList.slice(
        accList.length - resultPeriods[resultPeriodIndex]
      );
      openPopUp(resultCpm, resultAcc);
    }
  } else if (userInput[userInput.length - 1] === "\n") {
    event.target.value = event.target.value.slice(
      0,
      event.target.value.length - 1
    );
  }
};

loadQuote();

// Test
//openPopUp();

const toggleCurrentCpm = () => {
  showCurrentCpm = !showCurrentCpm;

  if (showCurrentCpm) {
    currentCpmText.textContent = "Current CPM";
    storage.setItem(Storage_Current_Cpm, "true");
  } else {
    currentCpmText.textContent = "Last CPM";
    storage.setItem(Storage_Current_Cpm, "false");
  }
};

const resultPeriods = [5, 10, 15, Infinity];
let resultPeriodIndex =
  storage.getItem(Storage_Result_Period) === null
    ? 0
    : parseInt(storage.getItem(Storage_Result_Period));

resultPeriodValue.textContent =
  resultPeriodIndex === resultPeriods.length - 1
    ? "∞"
    : resultPeriods[resultPeriodIndex];

const resultPeriodValueChange = (event) => {
  if (event.target.classList.contains("fa-chevron-up")) {
    console.log("up");
    resultPeriodIndex++;
    if (resultPeriodIndex === resultPeriods.length) {
      resultPeriodIndex -= resultPeriods.length;
    }

    storage.setItem(Storage_Result_Period, resultPeriodIndex);

    resultPeriodValue.textContent =
      resultPeriodIndex === resultPeriods.length - 1
        ? "∞"
        : resultPeriods[resultPeriodIndex];
  } else {
    console.log("down");
    resultPeriodIndex--;
    if (resultPeriodIndex < 0) {
      resultPeriodIndex += resultPeriods.length;
    }
    storage.setItem(Storage_Result_Period, resultPeriodIndex);
    resultPeriodValue.textContent =
      resultPeriodIndex === resultPeriods.length - 1
        ? "∞"
        : resultPeriods[resultPeriodIndex];
  }
};

currentCpm.addEventListener("change", toggleCurrentCpm);

quoteInput.addEventListener("keydown", onKeyDown);

quoteInput.addEventListener("input", onInputChange);

resultPeriodDown.addEventListener("click", resultPeriodValueChange);
resultPeriodUp.addEventListener("click", resultPeriodValueChange);

// 붙여넣기 방지
quoteInput.addEventListener("paste", (event) => {
  event.preventDefault();
});
