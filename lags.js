// Anas's portfolio: simple browser-only interactions.
// No Python server or database is needed. Local Storage saves data in this browser.

const menuButton = document.querySelector("#menuButton");
const navigation = document.querySelector("#navigation");
const themeButton = document.querySelector("#themeButton");

// 1. Open and close the mobile menu.
menuButton.addEventListener("click", () => {
  navigation.classList.toggle("open");
  const menuIsOpen = navigation.classList.contains("open");
  menuButton.textContent = menuIsOpen ? "✕" : "☰";
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navigation.classList.remove("open");
    menuButton.textContent = "☰";
  });
});

// 2. Remember the visitor's theme with Local Storage.
if (localStorage.getItem("anasTheme") === "light") {
  document.body.classList.add("light-theme");
  themeButton.textContent = "☀";
}

themeButton.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  const isLight = document.body.classList.contains("light-theme");
  themeButton.textContent = isLight ? "☀" : "☼";
  localStorage.setItem("anasTheme", isLight ? "light" : "dark");
});

// 3. Switch the example code shown in the skills section.
const codeExamples = {
  javascript: `const dailyMission = () => {
  learnSomething();
  buildSomething();
  practiseSafely();
};`,
  python: `def daily_mission():
    learn_something()
    build_something()
    practise_safely()

daily_mission()`,
  html: `<section class="mission">
  <h1>Level Up</h1>
  <p>Train. Learn. Build.</p>
</section>`
};

const codeExample = document.querySelector("#codeExample");

document.querySelectorAll(".tab").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
    button.classList.add("active");
    codeExample.textContent = codeExamples[button.dataset.language];
  });
});

// 4. Filter project cards by category.
const filterButtons = document.querySelectorAll(".filter");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    const selectedFilter = button.dataset.filter;

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = selectedFilter === "all" || categories.includes(selectedFilter);
      card.classList.toggle("hidden", !shouldShow);
    });
  });
});

// 5. Create a sample calisthenics plan based on the selected options.
// This is a general template, not a medical or professional training assessment.
const planForm = document.querySelector("#planForm");
const planTitle = document.querySelector("#planTitle");
const planOutput = document.querySelector("#planOutput");
const savePlanButton = document.querySelector("#savePlan");
const saveMessage = document.querySelector("#saveMessage");

const goalNames = {
  strength: "Strength basics",
  handstand: "Handstand",
  planche: "Planche progression",
  frontlever: "Front lever progression",
  mobility: "Mobility & flexibility"
};

const exerciseLibrary = {
  beginner: {
    strength: ["Incline or knee push-ups", "Bodyweight squats", "Dead bug core exercise"],
    handstand: ["Wrist warm-up", "Wall walk only if comfortable and supervised", "Hollow body hold"],
    planche: ["Wrist preparation", "Scapular push-ups", "Plank hold"],
    frontlever: ["Scapular pulls with secure equipment", "Dead hang only if safe", "Hollow body hold"],
    mobility: ["Shoulder circles", "Gentle hip mobility", "Ankle mobility"]
  },
  intermediate: {
    strength: ["Push-ups", "Split squats", "Rows using secure equipment"],
    handstand: ["Wrist warm-up", "Wall-supported handstand practice", "Hollow body hold"],
    planche: ["Wrist preparation", "Planche leans only if pain-free", "Scapular push-ups"],
    frontlever: ["Scapular pulls", "Tuck hold progression", "Hollow body hold"],
    mobility: ["Shoulder mobility", "Hip flexor mobility", "Hamstring mobility"]
  },
  advanced: {
    strength: ["Push-up variation with clean technique", "Single-leg squat progression", "Pull-up variation if already mastered"],
    handstand: ["Wrist and shoulder warm-up", "Wall handstand line drills", "Balance practice near a safe wall"],
    planche: ["Wrist preparation", "Appropriate planche progression", "Scapular strength work"],
    frontlever: ["Scapular pulls", "Appropriate lever progression", "Hollow body work"],
    mobility: ["Controlled shoulder mobility", "Hip mobility sequence", "Active flexibility drills"]
  }
};

function makeTrainingPlan(level, goal, days) {
  const goalExercises = exerciseLibrary[level][goal];
  const generalExercises = ["Warm up gently for 5–10 minutes", ...goalExercises, "Finish with easy mobility"];
  const restDay = "Rest or take a gentle walk. Recovery is part of training.";
  const schedule = [];

  // Spread sessions through the week and include recovery days.
  const sessionNames = ["Session 1", "Session 2", "Session 3", "Session 4", "Session 5"];
  for (let index = 0; index < 7; index++) {
    if (index < days) {
      schedule.push({
        day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index],
        title: sessionNames[index],
        details: generalExercises
      });
    } else {
      schedule.push({
        day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index],
        title: "Recovery",
        details: [restDay]
      });
    }
  }

  // For fewer training days, put the sessions on alternating days.
  if (days === 3) {
    schedule[1] = { day: "Tuesday", title: "Recovery", details: [restDay] };
    schedule[2] = { day: "Wednesday", title: "Session 2", details: generalExercises };
    schedule[3] = { day: "Thursday", title: "Recovery", details: [restDay] };
    schedule[4] = { day: "Friday", title: "Session 3", details: generalExercises };
    schedule[5] = { day: "Saturday", title: "Recovery", details: [restDay] };
    schedule[6] = { day: "Sunday", title: "Recovery", details: [restDay] };
  } else if (days === 4) {
    schedule[2] = { day: "Wednesday", title: "Recovery", details: [restDay] };
    schedule[3] = { day: "Thursday", title: "Session 3", details: generalExercises };
    schedule[4] = { day: "Friday", title: "Recovery", details: [restDay] };
    schedule[5] = { day: "Saturday", title: "Session 4", details: generalExercises };
    schedule[6] = { day: "Sunday", title: "Recovery", details: [restDay] };
  }

  return schedule;
}

function showPlan(plan, level, goal, days) {
  planTitle.textContent = `${goalNames[goal]} • ${level.charAt(0).toUpperCase() + level.slice(1)}`;
  planOutput.innerHTML = "";

  plan.forEach((session) => {
    const dayBox = document.createElement("div");
    dayBox.className = "day-plan";

    const heading = document.createElement("h4");
    heading.textContent = `${session.day} — ${session.title}`;

    const details = document.createElement("p");
    details.textContent = session.details.join(" • ");

    dayBox.append(heading, details);
    planOutput.appendChild(dayBox);
  });

  savePlanButton.dataset.plan = JSON.stringify({ level, goal, days, plan });
  saveMessage.textContent = "Plan generated. Save it if you want to keep it in this browser.";
}

planForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const level = document.querySelector("#level").value;
  const goal = document.querySelector("#goal").value;
  const days = Number(document.querySelector("#days").value);
  const plan = makeTrainingPlan(level, goal, days);
  showPlan(plan, level, goal, days);
});

// 6. Save the generated plan locally. It is not uploaded to a server.
savePlanButton.addEventListener("click", () => {
  const planData = savePlanButton.dataset.plan;
  if (!planData) {
    saveMessage.textContent = "Generate a plan first, then save it.";
    return;
  }

  localStorage.setItem("anasSavedPlan", planData);
  saveMessage.textContent = "Saved! Your plan is stored in this browser.";
});

// 7. Save checklist progress in Local Storage.
const goalCheckboxes = document.querySelectorAll("[data-goal]");

goalCheckboxes.forEach((checkbox) => {
  const storageKey = `anasGoal-${checkbox.dataset.goal}`;
  checkbox.checked = localStorage.getItem(storageKey) === "true";

  checkbox.addEventListener("change", () => {
    localStorage.setItem(storageKey, String(checkbox.checked));
  });
});

// 8. If a plan was saved earlier, show it when the page opens.
const savedPlanText = localStorage.getItem("anasSavedPlan");
if (savedPlanText) {
  try {
    const savedPlan = JSON.parse(savedPlanText);
    showPlan(savedPlan.plan, savedPlan.level, savedPlan.goal, savedPlan.days);
    saveMessage.textContent = "Loaded your previously saved plan from this browser.";
  } catch (error) {
    // If saved data is damaged, the planner can still create a new plan.
    localStorage.removeItem("anasSavedPlan");
  }
}
