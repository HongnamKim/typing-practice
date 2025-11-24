const darkModeButton = document.getElementById("dark-mode");
const sunIcon = document.getElementById("icon-sun");
const moonIcon = document.getElementById("icon-moon");

const allElement = document.querySelectorAll("*");

const storage = window.localStorage;

// localStorage 값 먼저 확인
const darkMode = storage.getItem(Storage_Dark_Mode);

let isDarkMode;

// 기존 설정 값이 없을 경우
if (darkMode === null) {
  // 브라우저가 다크 모드를 지원하는지 확인
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    //console.log("브라우저의 기본 테마는 다크 모드입니다.");

    isDarkMode = true;
    storage.setItem(Storage_Dark_Mode, "true");

    sunIcon.classList.add("display-none");
    moonIcon.classList.remove("display-none");

    allElement.forEach((elem) => {
      elem.classList.remove("bright");
      elem.classList.add("dark");
    });
  } else {
    //console.log("브라우저의 기본 테마는 라이트 모드입니다.");

    isDarkMode = false;
    storage.setItem(Storage_Dark_Mode, "false");

    sunIcon.classList.remove("display-none");
    moonIcon.classList.add("display-none");

    allElement.forEach((elem) => {
      elem.classList.remove("dark");
      elem.classList.add("bright");
    });
  }
} else {
  // 기본 설정이 있는 경우
  isDarkMode = darkMode === "true";

  if (isDarkMode) {
    sunIcon.classList.add("display-none");
    moonIcon.classList.remove("display-none");

    allElement.forEach((elem) => {
      elem.classList.remove("bright");
      elem.classList.add("dark");
    });
  } else {
    sunIcon.classList.remove("display-none");
    moonIcon.classList.add("display-none");

    allElement.forEach((elem) => {
      elem.classList.remove("dark");
      elem.classList.add("bright");
    });
  }
}

const toggleDarkMode = (event) => {
  const allElement = document.querySelectorAll("*");

  // event.target.checked
  if (event.target.classList.contains("fa-sun")) {
    storage.setItem(Storage_Dark_Mode, "true");
    isDarkMode = true;

    sunIcon.classList.add("display-none");
    moonIcon.classList.remove("display-none");

    allElement.forEach((elem) => {
      elem.classList.remove("bright");
      elem.classList.add("dark");
    });
  } else {
    storage.setItem(Storage_Dark_Mode, "false");
    isDarkMode = false;

    sunIcon.classList.remove("display-none");
    moonIcon.classList.add("display-none");

    allElement.forEach((elem) => {
      elem.classList.remove("dark");
      elem.classList.add("bright");
    });
  }
};

//darkModeButton.addEventListener("change", toggleDarkMode);

sunIcon.addEventListener("click", toggleDarkMode);
moonIcon.addEventListener("click", toggleDarkMode);
