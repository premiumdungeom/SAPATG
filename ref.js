// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  set,
  child,
  update,
  remove,
  get,
} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-database.js";

const usernameCont = document.querySelector(".usernameCont");
const usernameinput = document.querySelector("#usernameinput");
const submitBtn = document.querySelector("#submitBtn");
const refForm = document.querySelector("#refForm");
const CopyBtn = document.querySelector("#CopyBtn");
let userName;

const firebaseConfig = {
  apiKey: "AIzaSyD7N60pjSZd2cX5b7sC8VEWkq4DTWYnhyI",
  authDomain: "sapatg-ba630.firebaseapp.com",
  projectId: "sapatg-ba630",
  storageBucket: "sapatg-ba630.appspot.com",
  messagingSenderId: "213739469633",
  appId: "1:213739469633:web:af96904eab332a5842bfc0",
  measurementId: "G-YTGY6LXV2N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// *****
const db = getDatabase();

//FUNCTIONS
const topUpRef = async (e) => {
  e.preventDefault();
  const refUsername = usernameinput.value;
  update(ref(db, `users/${userName}`), {
    referred: true,
  });
  // Points
  const userPointsRef = ref(db, `users/${refUsername}/points`);
  get(userPointsRef).then((snapshot) => {
    // console.log(snapshot.val());
    const currentPoints = snapshot.exists() ? snapshot.val() : 0;
    update(ref(db, `users/${refUsername}`), {
      points: Number(currentPoints) + 1000,
    });
    e.target.parentNode.remove();
  });
  console.log(refUsername);
};

// 
const copyUsername = () =>{
  navigator.clipboard.writeText(userName);
}
// EVENTS
submitBtn.addEventListener("click", topUpRef);
CopyBtn.addEventListener("click", copyUsername);
// RUNS WHEN THE WEBSITE LOADS
window.addEventListener("load", () => {
  // userName = "Nuelyoungtech";
  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    userName = user.username;
  usernameCont.innerHTML = userName;
  get(ref(db, `users/${userName}/referred`)).then((snapshot) => {
    console.log(snapshot.val());
    const refExists = snapshot.exists() ? snapshot.val() : false;
    if (refExists) {
      refForm.classList.add("no_show");
    }
  });
}
});
/**
 *https://app.tonkeeper.com/ton-connect?v=2&id=testAppId123&r=%7B%22manifestUrl%22%3A%22https%3A%2F%2Fraw.githubusercontent.com%2Fnuex001%2FTonkeepermanifest%2Fmain%2Ftonconnect-manifest.json%22%2C%22items%22%3A%5B%7B%22name%22%3A%22ton_addr%22%7D%5D%7D
 */