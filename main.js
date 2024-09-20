const tapCount = document.querySelector(".tapCount");
const pointCont = document.querySelector(".pointCont");
const scoreCont = document.querySelector(".scoreCont");
const userCont = document.querySelector(".userCont");
const particleCount = 2;
let timer;
let points;
let userName;
// console.log(tapCount);

const getRandomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const tap = (e) => {
  // Creating our element
  if (
    Number(scoreCont.textContent) > 0 &&
    Number(scoreCont.textContent) <= 250
  ) {
    for (let index = 0; index < particleCount; index++) {
      const particle = document.createElement("h4");
      particle.textContent = 1;
      tapCount.appendChild(particle); //APPEND ELEMENT TO OUR TAP CONTAINER
      // RANDOMIZE THE PARTICLE STARTING POSTION
      const startX = e.clientX - tapCount.offsetLeft + getRandomInt(-50, 50);
      const startY = e.clientY - tapCount.offsetTop + getRandomInt(-50, 50);
      particle.style.top = `${startY}px`;
      particle.style.left = `${startX}px`;
      particle.style.opacity = 1;

      // WORKING ON THE END POINTS
      const endX = e.clientX - tapCount.offsetLeft + getRandomInt(-100, 100);
      const endY = e.clientY - tapCount.offsetTop + getRandomInt(-100, 100);

      setTimeout(() => {
        particle.style.bottom = `${endY}px`;
        particle.style.right = `${endX}px`;
        particle.style.opacity = 0;
      }, 500);

      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
    // DOM MANIPULATION
    points = Number(pointCont.textContent) + particleCount;
    pointCont.textContent = Number(pointCont.textContent) + particleCount;
    scoreCont.textContent = Number(scoreCont.textContent) - particleCount;
    localStorage.setItem(userName, points);
    if (timer) {
      // console.log(timer);
    } else {
      renewCount();
    }
  }
};

// RENEW COUNT, LIKE RENEW ENERGY
const renewCount = () => {
  timer = setInterval(() => {
    if (Number(scoreCont.textContent) >= 250) {
      clearInterval(timer);
      timer = undefined;
    } else {
      scoreCont.textContent = Number(scoreCont.textContent) + particleCount;
    }
  }, 500);
};

// EVENT LISTENERS
tapCount.addEventListener("click", tap);

// RUNS WHEN THE WEBSITE LOADS
window.addEventListener("load", () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    userName = user.username;
    userCont.textContent = user.username;
    if (localStorage.getItem(userName) !== "undefined") {
      console.log(localStorage.getItem(userName));
      const savedPoints = localStorage.getItem(userName);
      pointCont.textContent = Number(savedPoints);
    }
  }
});
// window.addEventListener("unload", () => {
//   localStorage.setItem(userName, points);
// });
