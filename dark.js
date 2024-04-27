const darkModeButton = document.getElementById("dark-mode");

const allElement = document.querySelectorAll("*");

// 브라우저가 다크 모드를 지원하는지 확인
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  //console.log("브라우저의 기본 테마는 다크 모드입니다.");
  darkModeButton.checked = true;

  allElement.forEach((elem) => {
    elem.classList.remove("bright");
    elem.classList.add("dark");
  });
} else {
  //console.log("브라우저의 기본 테마는 라이트 모드입니다.");
  darkModeButton.checked = false;

  allElement.forEach((elem) => {
    elem.classList.remove("dark");
    elem.classList.add("bright");
  });
}

const dark = (event) => {
  const allElement = document.querySelectorAll("*");

  if (event.target.checked) {
    allElement.forEach((elem) => {
      elem.classList.remove("bright");
      elem.classList.add("dark");
    });
  } else {
    allElement.forEach((elem) => {
      elem.classList.remove("dark");
      elem.classList.add("bright");
    });
  }
};

darkModeButton.addEventListener("change", dark);
