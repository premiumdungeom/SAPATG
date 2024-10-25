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

const taskCont = document.querySelector(".taskCont");
const txt_cont = document.querySelector(".txt_cont");
let userName;
let tasks;

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

// RENDER OUR HTML
const renderTaskBoard = (formattedTask) => {
  if (formattedTask.length > 0) {
    // console.log(formattedTask);
    console.log(formattedTask);

    let taskboardHtml = formattedTask
      .map((task, idx) => {
        if (!task.checked) {
          return `
  <li>
           <div class="txtcount">
             <h4>${task.description}</h4>
             <h5>+${task.points} Ss</h5>
           </div>
           <a href="${task.link}" data-index=${task.id} target="_blank" class="btn"> Open </a>
         </li>
   `;
        }
      })
      .join("");
    taskCont.innerHTML = taskboardHtml;
    // console.log(taskboardHtml);
  } else {
    taskCont.innerHTML = `<li>
            <div class="txtcount">
              <h4>Follow our X account</h4>
              <h5>+20 Ss</h5>
            </div>
            <a href="#" target="_blank" class="btn"> Open </a>
          </li>
          <li>`;
  }
};

// FORMAT TASKS
const formatTasks = (taskData) => {
  const data = taskData.map((text, idx) => {
    const [description, link, points] = text.split(",");
    return {
      description: description.trim(),
      link: link.trim(),
      points: Number(points.trim()),
      id: idx,
      checked: false,
    };
    // console.log(text.split(","));
  });
  return data;
};

// HANDLE CLICK EVENT

const handleTaskClick = (e) => {
  const taskId = e.target.getAttribute("data-index");
  const taskLink = e.target.getAttribute("href");
  // console.log(taskLink);
  window.open(taskLink,"_blank");
  const userTaskRef = ref(db, `userTasks/${userName}/${taskId}`);
  const userPointsRef = ref(db, `users/${userName}/points`);

  set(userTaskRef, true)
    .then(() => {
      const taskPoints = tasks[taskId].points;
      console.log(taskPoints);
      get(userPointsRef).then((snapshot) => {
        // if (snapshot.exists()) {
        // console.log(snapshot.val());
        // }
        let currentPoints = snapshot.exists() ? snapshot.val().points : 0;
        update(userPointsRef, {
          points: Number(currentPoints) + taskPoints,
        });
       // console.log(e.target.parentNode);
        // e.target.parentNode.remove(); this one doesn't work on telegram apps, due to the limited browser features and constraints of the Telegram in-app browser
        e.target.parentNode.style.display = "none"; //this one works
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

// RUNS WHEN USER CLICKS ON TASKCONT
taskCont.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("btn")) {
    handleTaskClick(e);
  }
});

// RUNS WHEN THE WEBSITE LOADS
window.addEventListener("load", () => {
  if (window.Telegram && window.Telegram.WebApp) {
    const user = window.Telegram.WebApp.initDataUnsafe?.user;
    userName = user.username;
  const dbRef = ref(db);
  get(child(dbRef, "Tasks"))
    .then((snapshot) => {
      if (snapshot.exists()) {
        const taskData = snapshot.val();
        const formattedTask = formatTasks(taskData);
        tasks = formattedTask;
        const userTaskRef = ref(db, `userTasks/${userName}`);
        get(userTaskRef).then((snapshot) => {
          if (snapshot.exists()) {
            const userTaskData = snapshot.val();
            console.log(userTaskData);
            formattedTask.forEach((task, idx) => {
              if (userTaskData[idx]) {
                task.checked = true;
              }
            });
            renderTaskBoard(formattedTask);
          } else {
            renderTaskBoard(formattedTask);
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }
});
