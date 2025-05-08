let flashcards = JSON.parse(localStorage.getItem("flashcards") || "[]");
let flashIndex = 0;
let flashWrong = [];
function switchTab(tabId) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.content').forEach(c => c.classList.remove('active'));
  document.querySelector(".tab[onclick*='" + tabId + "']").classList.add('active');
  document.getElementById(tabId).classList.add('active');

  // ✅ Force calendar to render ONLY when calendar tab is opened
  if (tabId === "calendar") {
    loadCalendarView();
  }
}

    

        function autoResetWeeklyPlanner() {
  const now = new Date();
  const lastReset = localStorage.getItem("last_reset_date");

  // Check if today is Sunday (0) and time is past midnight
  if (now.getDay() === 0 && (!lastReset || lastReset !== now.toDateString())) {
    const backup = {};
    days.forEach(day => {
      const val = localStorage.getItem("plan_" + day);
      backup[day] = val;
    });

    const backupKey = "weekly_backup_" + now.toISOString().split("T")[0];
    localStorage.setItem(backupKey, JSON.stringify(backup));

    // Clear current planner
    days.forEach(day => {
      localStorage.setItem("plan_" + day, "");
      document.getElementById("plan_" + day).value = "";
    });

    localStorage.setItem("last_reset_date", now.toDateString());
    alert("Weekly plan reset. Backup saved as: " + backupKey);
  }
}
function viewBackups() {
  const div = document.getElementById("backupView");
  div.innerHTML = "<h3>Archived Weekly Plans:</h3>";
  for (let key in localStorage) {
    if (key.startsWith("weekly_backup_")) {
      const backup = JSON.parse(localStorage.getItem(key));
      div.innerHTML += `<strong>${key}</strong><pre>${JSON.stringify(backup, null, 2)}</pre><hr>`;
    }
  }
}




  // DAILY SCHEDULE LOGIC
  const schedule = {
    'Sunday': ["Science", "Islamic", "P.E.", "Math", "English", "Arabic", "Life Skills"],
    'Monday': ["Science", "Computer", "Math", "Arabic", "Math", "Islamic"],
    'Tuesday': ["Art", "Science", "Islamic", "P.E.", "Arabic", "Math"],
    'Wednesday': ["English", "Social Studies", "Islamic", "Arabic", "Math", "Science"],
    'Thursday': ["Arabic", "Math", "Social Studies", "English", "Computer", "Islamic"]
  };

  const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const today = new Date();
  const dayIndex = today.getDay();

  let scheduleDay = '';
  switch (dayIndex) {
    case 0: scheduleDay = 'Monday'; break;       // Sunday
    case 1: scheduleDay = 'Tuesday'; break;      // Monday
    case 2: scheduleDay = 'Wednesday'; break;    // Tuesday
    case 3: scheduleDay = 'Thursday'; break;     // Wednesday
    case 4: scheduleDay = 'Sunday'; break;       // Thursday
    case 5: scheduleDay = 'Sunday'; break;       // Friday
    case 6: scheduleDay = 'Sunday'; break;       // Saturday
  }

  document.getElementById('dayInfo').innerText = "Prepare for: " + scheduleDay;

  const classList = schedule[scheduleDay];
  const scheduleDiv = document.getElementById("scheduleList");

  if (!classList || classList.length === 0) {
    scheduleDiv.innerText = "No classes today!";
  } else {
    classList.forEach(cls => {
      const div = document.createElement("div");
      div.classList.add("class-item");
      div.innerHTML = cls + ": <input type='text' id='" + cls + "' placeholder='Y or N'>";
      scheduleDiv.appendChild(div);
    });
  }

  function startCheck() {
    let missing = [];
    classList.forEach(cls => {
      const val = document.getElementById(cls).value.trim().toUpperCase();
      if (val !== "Y") {
        missing.push(cls);
      }
    });
    if (missing.length > 0) {
      alert("You missed these books: " + missing.join(", "));
    } else {
      alert("Thank you for doing your daily schedule attack!");
    }
  }

  // REVISION ZONE
  function saveRevision() {
    const notes = document.getElementById("revisionNotes").value;
    localStorage.setItem("revision_notes", notes);
    alert("Saved!");
  }
  document.getElementById("revisionNotes").value = localStorage.getItem("revision_notes") || '';

  // WEEKLY PLAN
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const plannerDiv = document.getElementById("plannerContent");
  days.forEach(day => {
    const label = document.createElement("label");
    label.innerText = day + ":";
    const textarea = document.createElement("textarea");
    textarea.id = "plan_" + day;
    textarea.value = localStorage.getItem("plan_" + day) || '';
    plannerDiv.appendChild(label);
    plannerDiv.appendChild(textarea);
  });

  function savePlanner() {
    days.forEach(day => {
      const val = document.getElementById("plan_" + day).value;
      localStorage.setItem("plan_" + day, val);
    });
    alert("Weekly plan saved!");
  }
  autoResetWeeklyPlanner();
  function runAISuggestions() {
  const suggestions = [];
  runCustomAIRules(classList, suggestions);


  if (!classList) return;

  if (classList.includes("P.E.") || classList.includes("PE")) {
    suggestions.push("Pack your PE clothes and water bottle!");
  }

  if (classList.includes("Islamic") && classList.includes("Arabic")) {
    suggestions.push("Charge your iPad! You have Islamic and Arabic together.");
  }

  if (classList.includes("Science") && classList.includes("Math")) {
    suggestions.push("You might need your calculator for Science and Math.");
  }

  if (classList.includes("Art")) {
    suggestions.push("Bring your sketchbook or colors for Art.");
  }

  if (classList.includes("Life Skills")) {
    suggestions.push("Check the Life Skills folder or project sheet.");
  }

  const ul = document.getElementById("suggestions");
const log = document.getElementById("memoryLog");
ul.innerHTML = "";
log.innerHTML = "";

suggestions.forEach(text => {
  const li = document.createElement("li");
  li.textContent = text;
  ul.appendChild(li);

  // Save to memory log
  const memory = JSON.parse(localStorage.getItem("attackbot_log") || "[]");
  memory.push({ text: text, date: new Date().toLocaleString() });
  localStorage.setItem("attackbot_log", JSON.stringify(memory));
});
// Display in Smart Reminders box
const smartBox = document.getElementById("smartReminders");
smartBox.innerHTML = "";
suggestions.forEach(text => {
  const li = document.createElement("li");
  li.textContent = text;
  smartBox.appendChild(li);
});

// Load all past logs
const memory = JSON.parse(localStorage.getItem("attackbot_log") || "[]");
memory.slice(-5).reverse().forEach(entry => {
  const li = document.createElement("li");
  li.textContent = `[${entry.date}] ${entry.text}`;
  log.appendChild(li);
});
  }

// Run the AI when the page loads
runAISuggestions();
function loadCustomRules() {
  const ruleList = JSON.parse(localStorage.getItem("custom_rules") || "[]");
  const list = document.getElementById("customRulesList");
  list.innerHTML = "";
  ruleList.forEach((rule, index) => {
    const li = document.createElement("li");
    li.textContent = `If class is "${rule.className}", say: "${rule.response}"`;
    list.appendChild(li);
  });
}

function addCustomRule() {
  const className = document.getElementById("customTrigger").value.trim();
  const response = document.getElementById("customResponse").value.trim();
  if (!className || !response) return alert("Please fill both fields!");

  const ruleList = JSON.parse(localStorage.getItem("custom_rules") || "[]");
  ruleList.push({ className, response });
  localStorage.setItem("custom_rules", JSON.stringify(ruleList));
  loadCustomRules();
  document.getElementById("customTrigger").value = "";
  document.getElementById("customResponse").value = "";
}

// Run custom AI rules when AttackBot loads
function runCustomAIRules(classList, suggestions) {
  const ruleList = JSON.parse(localStorage.getItem("custom_rules") || "[]");
  ruleList.forEach(rule => {
    if (classList.includes(rule.className)) {
      suggestions.push("🧠 AttackBot says: " + rule.response);
    }
  });
}
if ('speechSynthesis' in window) {
  const allText = suggestions.join(". ");
  const speech = new SpeechSynthesisUtterance(allText);
  speech.lang = 'en-US';
  speech.rate = 1;
  speech.pitch = 1;
  speech.volume = 1;
  window.speechSynthesis.speak(speech);
}
 else {
  console.log("Speech synthesis not supported in this browser.");
}
// 1. Homework Tracker
function addHomework() {
  const subject = document.getElementById("hwSubject").value;
  const task = document.getElementById("hwTask").value;
  const due = document.getElementById("hwDue").value;
  if (!subject || !task || !due) return;
  const entry = `${subject}: ${task} (Due ${due})`;
  const ul = document.getElementById("homeworkList");
  const li = document.createElement("li");
  li.textContent = entry;
  ul.appendChild(li);
  document.getElementById("hwSubject").value = "";
  document.getElementById("hwTask").value = "";
  document.getElementById("hwDue").value = "";
}

// 2. Exam Countdown
function addExam() {
  const subject = document.getElementById("examSubject").value;
  const date = document.getElementById("examDate").value;
  if (!subject || !date) return;

  const examList = JSON.parse(localStorage.getItem("exam_list") || "[]");
  examList.push({ subject, date });
  localStorage.setItem("exam_list", JSON.stringify(examList));
  updateExamCountdown();
}

function updateExamCountdown() {
  const list = document.getElementById("examCountdownList");
  list.innerHTML = "";
  const today = new Date();
  const examList = JSON.parse(localStorage.getItem("exam_list") || "[]");

  examList.forEach(exam => {
    const examDate = new Date(exam.date);
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    const li = document.createElement("li");
    li.textContent = `${exam.subject}: ${daysLeft} day(s) left`;
    list.appendChild(li);
  });
}

// Load exam list when page opens
updateExamCountdown();









// 4. Sticky Note
function saveNote() {
  const note = document.getElementById("quickNote").value;
  localStorage.setItem("quick_note", note);
  document.getElementById("savedNote").innerText = note;
}
document.getElementById("savedNote").innerText = localStorage.getItem("quick_note") || "";
function dailyHomeworkReminder() {
  const today = new Date().getDay(); // 0 = Sunday, 6 = Saturday
  const reminderDays = [0, 1, 2, 3, 6]; // Sun, Mon, Tues, Wed, Sat

  if (reminderDays.includes(today)) {
    if (Notification.permission === "granted") {
      new Notification("Homework Reminder", {
        body: "Hey Albaraa! Do your homework today 📚",
        icon: "logo.png"
      });
    } else {
      Notification.requestPermission();
    }
  }
}

// Run it after page load
setTimeout(dailyHomeworkReminder, 2000); // small delay so page loads





// 5. Flashcards


function addFlashcard() {
  const q = document.getElementById("flashQ").value.trim();
  const a = document.getElementById("flashA").value.trim();

  if (!q || !a) {
    alert("Please fill in both question and answer.");
    return;
  }

  flashcards.push({ q, a, score: 0 });
  localStorage.setItem("flashcards", JSON.stringify(flashcards));
  document.getElementById("flashQ").value = "";
  document.getElementById("flashA").value = "";
  alert("Flashcard added!");
}

function showFlashcard() {
  const pool = flashWrong.length > 0 ? flashWrong : flashcards;
  const current = pool[flashIndex % pool.length];

  document.getElementById("flashcardDisplay").innerHTML = `
    <strong>Q:</strong> ${current.q}<br>
    <button onclick="showAnswer('${current.q}')">Show Answer</button>
  `;
}



function showAnswer(question) {
  const all = flashcards;
  const current = all.find(fc => fc.q === question);

  document.getElementById("flashcardDisplay").innerHTML = `
    <strong>Q:</strong> ${current.q}<br>
    <strong>A:</strong> ${current.a}<br><br>
    <button onclick="markAnswer('${question}', true)">✅ I got it right</button>
    <button onclick="markAnswer('${question}', false)">❌ I got it wrong</button>
  `;
}
function startQuiz() {
  flashcards = JSON.parse(localStorage.getItem("flashcards") || "[]");

  if (flashcards.length === 0) {
    document.getElementById("flashcardDisplay").innerHTML = "No flashcards found.";
    return;
  }

  flashWrong = [];         // Reset wrong answer list
  flashIndex = 0;          // Reset counter
  showFlashcard();         // Show the first card
}

function markAnswer(question, correct) {
  const all = flashcards;
  const current = all.find(fc => fc.q === question);
  if (!current) return;

  if (correct) {
    current.score += 1;
    flashWrong = flashWrong.filter(fc => fc.q !== question);
  } else {
    current.score = 0;
    if (!flashWrong.some(fc => fc.q === question)) {
      flashWrong.push(current);
    }
  }

  localStorage.setItem("flashcards", JSON.stringify(all));
  flashIndex++;
  showFlashcard();
}
function loadCalendarView() {
  console.log("📅 Calendar view loaded");

  const schedule = {
    'Sunday': ["Science", "Islamic", "P.E.", "Math", "English", "Arabic"],
    'Monday': ["Science", "Computer", "Math", "Arabic", "Math", "Islamic"],
    'Tuesday': ["Art", "Science", "Islamic", "P.E.", "Arabic", "Math"],
    'Wednesday': ["English", "Social Studies", "Islamic", "Arabic", "Math", "Science"],
    'Thursday': ["Arabic", "Math", "Social Studies", "English", "Computer", "Islamic"]
  };

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"];
  const maxPeriods = Math.max(...days.map(day => schedule[day].length));
  const tbody = document.getElementById("calendarBody");
  tbody.innerHTML = "";

  for (let period = 0; period < maxPeriods; period++) {
    const row = document.createElement("tr");

    const periodCell = document.createElement("td");
    periodCell.textContent = "Period " + (period + 1);
    row.appendChild(periodCell);

    days.forEach(day => {
      const cell = document.createElement("td");
      const cls = schedule[day][period];
      cell.textContent = cls ? cls : "-";
      row.appendChild(cell);
    });

    tbody.appendChild(row);
  }
}
    document.addEventListener('DOMContentLoaded', function () {
        const calendarEl = document.getElementById('calendar');
        const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridWeek',
        events: [
            { title: 'Science Test', date: '2025-05-12' },
            { title: 'PE Exam', date: '2025-05-15' }
        ]
        });
        calendar.render();
    });

    function loadSubjectNote() {
  const subject = document.getElementById("noteSubject").value;
  const note = localStorage.getItem("note_" + subject) || "";
  document.getElementById("subjectNote").value = note;
}

function saveSubjectNote() {
  const subject = document.getElementById("noteSubject").value;
  const note = document.getElementById("subjectNote").value;
  localStorage.setItem("note_" + subject, note);
  alert("Note saved for " + subject + "!");
}
function saveEvaluation() {
    const date = new Date().toISOString().split("T")[0];
    const understand = parseInt(document.getElementById("evalUnderstand").value);
    const focus = parseInt(document.getElementById("evalFocus").value);
    const homework = parseInt(document.getElementById("evalHomework").value);
  
    const log = JSON.parse(localStorage.getItem("daily_eval_log") || "[]");
    log.push({ date, understand, focus, homework });
    localStorage.setItem("daily_eval_log", JSON.stringify(log));
    showEvaluationHistory();
  }
  
  function showEvaluationHistory() {
    const log = JSON.parse(localStorage.getItem("daily_eval_log") || "[]");
    const div = document.getElementById("evaluationHistory");
    div.innerHTML = "<h4>📅 History</h4>";
  
    if (log.length === 0) {
      div.innerHTML += "<p>No evaluations yet.</p>";
      return;
    }
  
    log.slice(-7).reverse().forEach(entry => {
      div.innerHTML += `
        <strong>${entry.date}</strong><br>
        🧠 ${"⭐".repeat(entry.understand)}<br>
        🎯 ${"⭐".repeat(entry.focus)}<br>
        📚 ${"⭐".repeat(entry.homework)}<br><hr>
      `;
    });
  }
  
  let homeworkTimer = null;

function startHomeworkTimer() {
  const timerDisplay = document.getElementById("timerStatus");
  let seconds = 0;

  if (homeworkTimer) clearInterval(homeworkTimer);

  homeworkTimer = setInterval(() => {
    seconds++;
    timerDisplay.textContent = "⏱️ Homework time: " + Math.floor(seconds / 60) + " min " + (seconds % 60) + " sec";
  }, 1000);
}

function completeHomework() {
  if (homeworkTimer) {
    clearInterval(homeworkTimer);
    homeworkTimer = null;
  }

  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("last_homework_day", today);

  let streak = parseInt(localStorage.getItem("homework_streak") || "0");
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  const last = localStorage.getItem("last_homework_done");

  if (last === yesterday) {
    streak++;
  } else if (last !== today) {
    streak = 1;
  }

  localStorage.setItem("homework_streak", streak);
  localStorage.setItem("last_homework_done", today);

  document.getElementById("timerStatus").textContent = "";
  updateStreakDisplay();
}

function updateStreakDisplay() {
  const streak = parseInt(localStorage.getItem("homework_streak") || "0");
  document.getElementById("streakStatus").textContent = `🔥 Current Streak: ${streak} day(s)`;
}
function saveTopics() {
    const subject = document.getElementById("masterySubject").value;
    const raw = document.getElementById("topicInput").value.trim();
    if (!raw) return alert("Type some topics first!");
    const topics = raw.split(",").map(t => t.trim()).filter(t => t !== "");
  
    const checklist = {};
    topics.forEach(topic => {
      checklist[topic] = false; // not mastered yet
    });
  
    localStorage.setItem("mastery_" + subject, JSON.stringify(checklist));
    loadChecklist();
  }
  
  function loadChecklist() {
    const subject = document.getElementById("masterySubject").value;
    const data = JSON.parse(localStorage.getItem("mastery_" + subject) || "{}");
  
    const div = document.getElementById("topicList");
    div.innerHTML = "";
  
    const keys = Object.keys(data);
    if (keys.length === 0) {
      div.innerHTML = "<p>No topics yet for " + subject + ".</p>";
      return;
    }
  
    let mastered = 0;
  
    keys.forEach(topic => {
      const id = `check_${subject}_${topic}`;
      const checked = data[topic];
  
      if (checked) mastered++;
  
      const row = document.createElement("div");
      row.innerHTML = `
        <input type="checkbox" id="${id}" ${checked ? "checked" : ""} onchange="toggleTopic('${subject}', '${topic}')">
        <label for="${id}">${topic}</label>
      `;
      div.appendChild(row);
    });
  
    div.innerHTML += `<p><strong>${mastered}/${keys.length}</strong> topics mastered</p>`;
  }
  
  function toggleTopic(subject, topic) {
    const key = "mastery_" + subject;
    const data = JSON.parse(localStorage.getItem(key) || "{}");
    data[topic] = !data[topic];
    localStorage.setItem(key, JSON.stringify(data));
    loadChecklist(); // refresh display
  }
  
document.addEventListener("DOMContentLoaded", function () {
  loadSubjectNote();
});

function addGoal() {
    const goalText = document.getElementById("goalInput").value.trim();
    if (!goalText) return;
  
    const goals = JSON.parse(localStorage.getItem("mini_goals") || "[]");
    goals.push({ text: goalText, done: false });
    localStorage.setItem("mini_goals", JSON.stringify(goals));
    document.getElementById("goalInput").value = "";
    loadGoals();
  }
  
  function loadGoals() {
    const goals = JSON.parse(localStorage.getItem("mini_goals") || "[]");
    const list = document.getElementById("goalList");
    list.innerHTML = "";
  
    goals.forEach((goal, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" id="goal_${index}" ${goal.done ? "checked" : ""} 
               onchange="toggleGoal(${index})">
        <label for="goal_${index}" style="${goal.done ? 'text-decoration: line-through;' : ''}">
          ${goal.text}
        </label>
      `;
      list.appendChild(li);
    });
  }
  
  function toggleGoal(index) {
    const goals = JSON.parse(localStorage.getItem("mini_goals") || "[]");
    goals[index].done = !goals[index].done;
    localStorage.setItem("mini_goals", JSON.stringify(goals));
    loadGoals();
  }
  
    document.addEventListener("DOMContentLoaded", function () {
  loadCalendarView();
});
document.addEventListener("DOMContentLoaded", function () {
    showEvaluationHistory();
  });
  document.addEventListener("DOMContentLoaded", function () {
    updateStreakDisplay();
  });
  document.addEventListener("DOMContentLoaded", function () {
    loadChecklist();
  });
  document.addEventListener("DOMContentLoaded", function () {
    loadGoals();
  });
  
