/* ============================================================
   CORE APP STATE
   ============================================================ */
let foodDB = [];
const standardUnits = { gram: 1 };

let totals = { cal: 0, pro: 0, carb: 0, fat: 0, fib: 0 };
let currentFood = null;

// Store last added item for Undo
let lastEntry = null;

/* ============================================================
   DOM ELEMENTS
   ============================================================ */
const searchInput = document.getElementById("food-search");
const suggestionsBox = document.getElementById("suggestions-box");
const unitSelect = document.getElementById("unit-select");
const quantityInput = document.getElementById("quantity");
const foodList = document.getElementById("food-list");
const goalInput = document.getElementById("daily-goal");
const setGoalBtn = document.getElementById("set-goal-btn");
const undoBtn = document.getElementById("undo-btn");

/* ============================================================
   1. LOAD THE DATABASE (foods.json)
   ============================================================ */
fetch("foods.json")
  .then((response) => {
    if (!response.ok) throw new Error("HTTP error " + response.status);
    return response.json();
  })
  .then((data) => {
    foodDB = data;
    console.log("Database loaded:", foodDB.length, "items");
  })
  .catch((err) => {
    console.error("Error loading food database:", err);
    alert("Could not load foods.json — please upload it correctly.");
  });

/* ============================================================
   2. SEARCH AUTOCOMPLETE
   ============================================================ */
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();
  suggestionsBox.innerHTML = "";

  if (query.length < 2) {
    suggestionsBox.style.display = "none";
    return;
  }

  const matches = foodDB
    .filter((f) => f.name.toLowerCase().includes(query))
    .slice(0, 10);

  if (matches.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  matches.forEach((food) => {
    const div = document.createElement("div");
    div.className = "suggestion-item";
    div.innerHTML = `
      <span>${food.name}</span>
      <small style="color:#888">${food.cal} kcal</small>
    `;
    div.onclick = () => selectFood(food);
    suggestionsBox.appendChild(div);
  });

  suggestionsBox.style.display = "block";
});

// Hide suggestions on outside click
document.addEventListener("click", (e) => {
  if (e.target !== searchInput) {
    suggestionsBox.style.display = "none";
  }
});

/* ============================================================
   3. SELECT FOOD & LOAD UNITS
   ============================================================ */
function selectFood(food) {
  currentFood = food;

  searchInput.value = food.name;
  suggestionsBox.style.display = "none";

  unitSelect.innerHTML = "";
  const allUnits = { ...standardUnits, ...food.weights };

  for (let unit in allUnits) {
    const opt = document.createElement("option");
    opt.value = allUnits[unit];
    opt.text = unit.charAt(0).toUpperCase() + unit.slice(1);
    unitSelect.add(opt);
  }
}

/* ============================================================
   4. ADD FOOD TO LIST
   ============================================================ */
function addFood() {
  if (!currentFood) {
    alert("Please select a food first.");
    return;
  }

  const qty = parseFloat(quantityInput.value);
  const unitWeight = parseFloat(unitSelect.value);
  const unitName = unitSelect.options[unitSelect.selectedIndex].text;

  if (qty <= 0 || isNaN(qty)) {
    alert("Enter a valid quantity.");
    return;
  }

  const grams = unitWeight * qty;
  const ratio = grams / 100;

  const added = {
    cal: Math.round(currentFood.cal * ratio),
    pro: currentFood.pro * ratio,
    carb: currentFood.carb * ratio,
    fat: currentFood.fat * ratio,
    fib: currentFood.fib * ratio,
  };

  totals.cal += added.cal;
  totals.pro += added.pro;
  totals.carb += added.carb;
  totals.fat += added.fat;
  totals.fib += added.fib;

  updateUI();
  addToList(currentFood.name, unitName, qty, added.cal);

  // Store last entry for undo
  lastEntry = { food: currentFood, unitWeight, qty, added };

  // Reset
  searchInput.value = "";
  currentFood = null;
  unitSelect.innerHTML = "";
}

/* ============================================================
   5. UPDATE UI (Totals + Circle + Bars)
   ============================================================ */
function updateUI() {
  document.getElementById("total-cal").textContent = Math.round(totals.cal);
  document.getElementById("total-pro").textContent = Math.round(totals.pro) + "g";
  document.getElementById("total-carb").textContent = Math.round(totals.carb) + "g";
  document.getElementById("total-fat").textContent = Math.round(totals.fat) + "g";
  document.getElementById("total-fib").textContent = Math.round(totals.fib) + "g";

  updateCircle();
  updateBars();
}

/* Animate circle chart */
function updateCircle() {
  const chart = document.getElementById("cal-circle-chart");
  const goal = parseInt(goalInput.value) || 2000;

  const pct = Math.min((totals.cal / goal) * 100, 100);

  chart.style.background = `
    conic-gradient(var(--primary) ${pct}%, #e2e8f0 ${pct}%)
  `;
}

/* Fill nutrient bars based on logical max values */
function updateBars() {
  const bars = {
    pro: Math.min((totals.pro / 150) * 100, 100),
    carb: Math.min((totals.carb / 300) * 100, 100),
    fat: Math.min((totals.fat / 70) * 100, 100),
    fib: Math.min((totals.fib / 40) * 100, 100),
  };

  document.querySelector(".pro .fill").style.width = bars.pro + "%";
  document.querySelector(".carb .fill").style.width = bars.carb + "%";
  document.querySelector(".fat .fill").style.width = bars.fat + "%";
  document.querySelector(".fib .fill").style.width = bars.fib + "%";
}

/* ============================================================
   ADD TO VISUAL LIST
   ============================================================ */
function addToList(name, unit, qty, cal) {
  const li = document.createElement("li");
  li.innerHTML = `
    <div>
      <strong>${name}</strong>
      <span>${qty} ${unit}</span>
    </div>
    <span class="item-cal">${cal} kcal</span>
  `;
  foodList.prepend(li);
}

/* ============================================================
   6. UNDO LAST ITEM
   ============================================================ */
undoBtn.addEventListener("click", () => {
  if (!lastEntry) {
    alert("No recent item to undo.");
    return;
  }

  // Subtract the previous entry
  totals.cal -= lastEntry.added.cal;
  totals.pro -= lastEntry.added.pro;
  totals.carb -= lastEntry.added.carb;
  totals.fat -= lastEntry.added.fat;
  totals.fib -= lastEntry.added.fib;

  // Remove the first list item
  if (foodList.firstChild) {
    foodList.firstChild.remove();
  }

  lastEntry = null;
  updateUI();
});

/* ============================================================
   7. SET GOAL
   ============================================================ */
setGoalBtn.addEventListener("click", () => {
  if (!goalInput.value || goalInput.value < 500) {
    alert("Enter a valid daily goal (e.g., 2000).");
    return;
  }
  updateCircle();
});

/* ============================================================
   8. RESET CALCULATOR
   ============================================================ */
function resetCalculator() {
  totals = { cal: 0, pro: 0, carb: 0, fat: 0, fib: 0 };
  foodList.innerHTML = "";
  searchInput.value = "";
  quantityInput.value = 1;
  unitSelect.innerHTML = "";
  currentFood = null;
  lastEntry = null;
  updateUI();
}
