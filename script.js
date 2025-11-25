const foodDB = [
    { name: "Roti (Chapati)", cal: 297, pro: 10, carb: 46, fat: 8, fib: 9, weights: { piece: 40, serving: 80 } },
    { name: "White Rice (Cooked)", cal: 130, pro: 2.7, carb: 28, fat: 0.3, fib: 0.4, weights: { bowl: 150, serving: 200, tbsp: 15 } },
    { name: "Dal Tadka", cal: 116, pro: 6, carb: 12, fat: 5, fib: 4, weights: { bowl: 200, serving: 250, tbsp: 15 } },
    { name: "Paneer Butter Masala", cal: 230, pro: 8, carb: 8, fat: 18, fib: 2, weights: { bowl: 200, serving: 250, tbsp: 20 } },
    { name: "Chicken Curry", cal: 140, pro: 15, carb: 6, fat: 7, fib: 1, weights: { bowl: 200, serving: 250, piece: 60 } },
    { name: "Idli", cal: 58, pro: 2, carb: 12, fat: 0.1, fib: 0.5, weights: { piece: 40, serving: 120 } },
    { name: "Dosa (Plain)", cal: 168, pro: 3, carb: 27, fat: 4, fib: 1, weights: { piece: 90, serving: 90 } },
    { name: "Samosa", cal: 260, pro: 3, carb: 24, fat: 17, fib: 2, weights: { piece: 50, serving: 100 } },
    { name: "Tea (Chai) with milk", cal: 70, pro: 2, carb: 10, fat: 2, fib: 0, weights: { cup: 150, serving: 150 } },
    { name: "Poha", cal: 130, pro: 2.5, carb: 24, fat: 3.5, fib: 0.5, weights: { plate: 150, bowl: 100 } },
    { name: "Egg (Boiled)", cal: 155, pro: 13, carb: 1.1, fat: 11, fib: 0, weights: { piece: 50 } }
];

const standardUnits = { gram: 1 };
let totals = { cal: 0, pro: 0, carb: 0, fat: 0, fib: 0 };
let currentFood = null;

const foodSelect = document.getElementById('food-select');
const unitSelect = document.getElementById('unit-select');
const quantityInput = document.getElementById('quantity');
const foodList = document.getElementById('food-list');

// Init
window.onload = () => {
    foodDB.sort((a, b) => a.name.localeCompare(b.name));
    foodDB.forEach((food, index) => {
        let opt = document.createElement('option');
        opt.value = index;
        opt.text = food.name;
        foodSelect.add(opt);
    });
};

function updateUnits() {
    unitSelect.innerHTML = "";
    const index = foodSelect.value;
    if (index === "") return;
    currentFood = foodDB[index];
    
    const allUnits = { ...standardUnits, ...currentFood.weights };
    for (let unit in allUnits) {
        let opt = document.createElement('option');
        opt.value = allUnits[unit]; 
        opt.text = unit.charAt(0).toUpperCase() + unit.slice(1);
        unitSelect.add(opt);
    }
}

function addFood() {
    if (!currentFood) { alert("Please select a food."); return; }
    
    const qty = parseFloat(quantityInput.value);
    const unitWeight = parseFloat(unitSelect.value);
    const unitName = unitSelect.options[unitSelect.selectedIndex].text;

    if (qty <= 0) return;

    const actualGrams = unitWeight * qty;
    const ratio = actualGrams / 100;

    const addedCal = Math.round(currentFood.cal * ratio);
    const addedPro = (currentFood.pro * ratio);
    const addedCarb = (currentFood.carb * ratio);
    const addedFat = (currentFood.fat * ratio);
    const addedFib = (currentFood.fib * ratio);

    totals.cal += addedCal;
    totals.pro += addedPro;
    totals.carb += addedCarb;
    totals.fat += addedFat;
    totals.fib += addedFib;

    updateDisplay();
    addToList(currentFood.name, unitName, qty, addedCal);
}

function updateDisplay() {
    document.getElementById('total-cal').textContent = Math.round(totals.cal);
    document.getElementById('total-pro').textContent = Math.round(totals.pro) + "g";
    document.getElementById('total-carb').textContent = Math.round(totals.carb) + "g";
    document.getElementById('total-fat').textContent = Math.round(totals.fat) + "g";
    document.getElementById('total-fib').textContent = Math.round(totals.fib) + "g";
}

function addToList(name, unit, qty, cal) {
    const li = document.createElement('li');
    li.innerHTML = `
        <div>
            <strong>${name}</strong>
            <span>${qty} ${unit}</span>
        </div>
        <span class="item-cal">${cal} kcal</span>
    `;
    foodList.prepend(li);
}

function resetCalculator() {
    totals = { cal: 0, pro: 0, carb: 0, fat: 0, fib: 0 };
    foodList.innerHTML = "";
    updateDisplay();
    quantityInput.value = 1;
    foodSelect.value = "";
    unitSelect.innerHTML = "";
    currentFood = null;
}
