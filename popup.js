const body = document.getElementById("body");
const popUp = document.getElementById("pop-up");

let showPopUp = true;

const closePopUp = (event) => {
  console.dir(event);
  //console.log(event.target.tagName);

  if (event.type === "click") {
    if (event.target.tagName === "BODY" && showPopUp) {
      console.log("closePopUp");
      popUp.classList.add("display-none");
    } else {
      console.log("refuse closePopUp");
    }
  }
};

body.addEventListener("click", closePopUp);
