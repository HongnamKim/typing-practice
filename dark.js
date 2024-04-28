const darkModeButton = document.getElementById("dark-mode");

const allElement = document.querySelectorAll("*");

const storage = window.localStorage;

//let darkMode = storage.getItem("darkMode") === "true";
//console.log(darkMode);

// 브라우저가 다크 모드를 지원하는지 확인
if (
  window.matchMedia &&
  window.matchMedia("(prefers-color-scheme: dark)").matches
) {
  //console.log("브라우저의 기본 테마는 다크 모드입니다.");
  darkModeButton.checked = true;
  //darkMode = true;

  allElement.forEach((elem) => {
    elem.classList.remove("bright");
    elem.classList.add("dark");
  });
} else {
  //console.log("브라우저의 기본 테마는 라이트 모드입니다.");
  darkModeButton.checked = false;
  //darkMode = false;

  allElement.forEach((elem) => {
    elem.classList.remove("dark");
    elem.classList.add("bright");
  });
}

const toggleDarkMode = (event) => {
  const allElement = document.querySelectorAll("*");

  if (event.target.checked) {
    //storage.setItem("darkMode", "true");

    //console.log(storage.getItem("darkMode") === "true");

    allElement.forEach((elem) => {
      elem.classList.remove("bright");
      elem.classList.add("dark");
    });
  } else {
    //storage.setItem("darkMode", "false");

    //console.log(storage.getItem("darkMode") === "true");

    allElement.forEach((elem) => {
      elem.classList.remove("dark");
      elem.classList.add("bright");
    });
  }
};

darkModeButton.addEventListener("change", toggleDarkMode);
