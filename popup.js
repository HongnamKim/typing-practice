const popUpBg = document.getElementById("pop-up-background");
const popUp = document.getElementById("pop-up");

const popUpAvgCpm = document.getElementById("pop-up-avg-cpm");
const popUpMaxCpm = document.getElementById("pop-up-max-cpm");
const popUpAcc = document.getElementById("pop-up-acc");

let showPopUp = false;

const openPopUp = (resultCpm, resultAcc) => {
  //console.log("pop up");
  showPopUp = true;

  popUpAvgCpm.textContent = `${Math.round(average(resultCpm))}`;
  popUpMaxCpm.textContent = `${Math.round(max(resultCpm))}`;
  popUpAcc.textContent = `${Math.round(average(resultAcc))}`;

  //console.log(`cpm ${average(resultCpm)}`);
  //console.log(`highest ${max(resultCpm)}`);
  //console.log(`acc ${average(resultAcc)}`);

  popUp.classList.remove("display-none");
  popUpBg.classList.remove("display-none");
};

const closePopUp = () => {
  //console.dir(event);
  //console.log(event.target.tagName);

  if (showPopUp) {
    console.log("closePopUp");
    popUp.classList.add("display-none");
    popUpBg.classList.add("display-none");
    showPopUp = false;
  } else {
    console.log("refuse closePopUp");
  }
};

popUpBg.addEventListener("click", closePopUp);
//popUpBg.addEventListener("keydown", closePopUp);
