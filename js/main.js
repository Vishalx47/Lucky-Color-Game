"use strict";

//dom selection
const myMoney = document.querySelector(".payment__total-amount");
const colorButtons = document.querySelectorAll(".color__button");
const numberButtons = document.querySelectorAll(".number__button");
const currPeriod = document.querySelector(".period");
const currTime = document.querySelector(".timer");
const resultContainer = document.querySelector(".result__container");
const popUp = document.querySelector(".pop-up-bet");
const cancelButton = document.querySelector(".bet__cancel");
const confirmButton = document.querySelector(".bet__confirm");
const inputAmount = document.querySelector(".bet__controls-input");
const amountButtons = document.querySelectorAll(".bet__controls-button");
const amountTypeButton = document.querySelectorAll(".bet__amount-button");
const popHeading = document.querySelector(".bet__heading");
const loader = document.querySelector(".loader");

/////////////////////////////////////////////////////////////////////
//important varibels
/////////////////////////////////////////////////////////////////////
//initial id
let id = 0;

//set user money
const addMoney = 500;
myMoney.textContent = addMoney;

//show result in this time
const showResultTime = 1000;

//user bet data
const userBet = {
  color: "",
  number: "",
  betAmount: "",
  userResult: "",
  gameId: "",
};

//user bet history
let userBetHistory = [];

/////////////////////////////////////////////////////////////////////
//helping function
/////////////////////////////////////////////////////////////////////
function removeBackgroundColor() {
  popHeading.classList.remove(`bet__heading--red`);
  popHeading.classList.remove(`bet__heading--voilet`);
  popHeading.classList.remove(`bet__heading--green`);
}

/////////////////////////
//generate html and ui
const html = function (data) {
  const html = `
          <div class="result__details">
            <h4 class="result__details-period">${(data.gameId - 1)
              .toString()
              .padStart(2, "0")}</h4>
            <h4 class="result__details-price result__details-price--${
              data.gameResult
            }">
              ${data.gameResult === "win" ? "+" : "-"}₹${data.gameBetAmount}
            </h4>
            <h4 class="result__details-number">${data.gameBetNumber
              .toString()
              .padStart(2, "0")}</h4>
            <h4 class="result__details-result result__details-result--${
              data.gameBetColor
            }">
              <span></span>
            </h4>
          </div>`;

  resultContainer.insertAdjacentHTML("afterbegin", html);
};

//warning message function
function warning() {
  document.querySelector(".not-enough-money").style.opacity = "1";
  document.querySelector(".bet__container").classList.add("animation-active");
  setTimeout(() => {
    document.querySelector(".not-enough-money").style.opacity = "0";
    document
      .querySelector(".bet__container")
      .classList.remove("animation-active");
  }, 2000);
}
/////////////////////////////////////////////////////////////////////
//random color function
const colors = ["red", "voilet", "green"];
let randomColors = colors[Math.floor(Math.random() * 3)];

//random number function
const number = [1, 2, 3, 4, 5, 6, 7, 8];
let randomNumber = number[Math.floor(Math.random() * 8)];

/////////////////////////////////////////////////////////////////////
//color button function
colorButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    const color = button.dataset.color;

    // set heading color and content
    removeBackgroundColor();
    popHeading.classList.add(`bet__heading--${color}`);
    popHeading.textContent = `Join ${color}`;

    //unhide pop up
    popUp.classList.add("popup-active");

    //set color to userbet object
    userBet.color = color;
  });
});

//number button function
numberButtons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const number = button.dataset.number;

    //unhide pop up
    popUp.classList.add("popup-active");

    // set heading number and color
    removeBackgroundColor();
    popHeading.textContent = `Join ${number.toString().padStart(2, "0")}`;

    //set number to userbet object
    userBet.number = number;
  });
});

//close popup
cancelButton.addEventListener("click", function (e) {
  popUp.classList.remove("popup-active");
});

//bet amount button
amountTypeButton.forEach((button) => {
  button.addEventListener("click", (e) => {
    const amountType = +button.dataset.amount;

    //set input value = amountype
    inputAmount.value = amountType;

    //bet increase function
    document.querySelector(
      ".bet__controls-increase"
    ).dataset.curramount = `+${amountType}`;

    //bet decrease function
    document.querySelector(
      ".bet__controls-decrease"
    ).dataset.curramount = `-${amountType}`;
  });
});

//bet amount control
amountButtons.forEach((button, i) => {
  button.addEventListener("click", (e) => {
    //guard clause
    if (
      button.classList.contains("bet__controls-decrease") &&
      +inputAmount.value < 10
    )
      return;

    //get bet value from dataset
    let nextAmount = +button.dataset.curramount;
    let currAmount = +inputAmount.value + nextAmount;

    //set bet to input
    inputAmount.value = currAmount;
  });
});

///////////////////////////////////
//conforme bet / and main function
///////////////////////////////////
confirmButton.addEventListener("click", function (e) {
  //guard clause for not enough money or not minimum money for bet
  if (+inputAmount.value > +myMoney.textContent) {
    document.querySelector(".not-enough-money").textContent =
      "Not enough balance";
    warning();
    return;
  }

  if (+inputAmount.value < 10) {
    document.querySelector(".not-enough-money").textContent =
      "Bet amount is not enough minimum is ₹10";
    warning();
    return;
  }
  //loader active
  loader.classList.add("loader-active");
  resultContainer.style.opacity = "0.2";

  //unhide popup
  popUp.classList.remove("popup-active");

  //set user bet to userObject
  const betAmount = inputAmount.value;
  userBet.betAmount = betAmount;

  //reassign random color and number
  randomColors = colors[Math.floor(Math.random() * 3)];
  randomNumber = number[Math.floor(Math.random() * 8)];

  //cheak bet color or number with random color/number
  window.setTimeout(() => {
    //loader-deactivate
    loader.classList.remove("loader-active");
    resultContainer.style.opacity = "1";

    //set id to userbet object
    userBet.gameId = ++id;

    ///////////////////////////
    //cheak function
    ///////////////////////////
    if (
      (+inputAmount.value <= +myMoney.textContent &&
        +inputAmount.value >= 10 &&
        userBet.color) ||
      userBet.number
    ) {
      /////////////////////////
      //color cheak function
      /////////////////////////
      if (userBet.color && userBet.color === randomColors) {
        myMoney.textContent = `${
          Number(myMoney.textContent) + Number(userBet.betAmount)
        }`;

        //set user result to userbet object
        userBet.userResult = "win";
      }
      /////////////////////////
      //number cheak function
      /////////////////////////
      else if (+userBet.number && +userBet.number === randomNumber) {
        myMoney.textContent = `${
          Number(myMoney.textContent) + Number(userBet.betAmount) * 8
        }`;

        //set user result and Number game win amount to userBet Object
        userBet.userResult = "win";
        userBet.betAmount = +userBet.betAmount * 8;
      }
      /////////////////////////
      //loss cheak function
      /////////////////////////
      else if (
        userBet.color !== randomColors &&
        userBet.number !== randomNumber
      ) {
        myMoney.textContent = `${
          Number(myMoney.textContent) - Number(userBet.betAmount)
        }`;

        //set user result to userbEt to Object
        userBet.userResult = "loss";
      }

      //set current bet data to object
      const userBetData = {
        gameBetColor: randomColors,
        gameBetNumber: randomNumber,
        gameResult: userBet.userResult,
        gameBetAmount: userBet.betAmount,
        gameId: id,
        userAmount: myMoney.textContent,
      };

      //generate html with current bet data
      html(userBetData);

      //set bet to localstorage
      userBetHistory.push(userBetData);
      localStorage.setItem("bets", JSON.stringify(userBetHistory));

      //set new id after current bet complete
      currPeriod.textContent = `${id}`.toString().padStart(2, "0");
    }

    //clear user bet before start new game
    userBet.color = "";
    userBet.number = "";
  }, showResultTime);
});

//on load set user bet history to ui with latest data
(function () {
  const betHistory = JSON.parse(localStorage.getItem("bets"));
  if (!betHistory) return;
  userBetHistory = betHistory;
  betHistory
    .map((bet) => {
      html(bet);
    })
    .join(" ");

  //set money and current id
  const latestBet = betHistory[betHistory.length - 1];
  console.log(latestBet);

  //user data ui
  myMoney.textContent = latestBet.userAmount;
  id = latestBet.gameId;
  document.querySelector(".period").textContent = id.toString();
})();

//clear local storage and start new game
document.querySelector(".reset__game").addEventListener("click", (e) => {
  window.localStorage.clear();
  window.location.reload();
});
