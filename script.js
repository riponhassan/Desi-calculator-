let foodDB = [];
const standardUnits = { gram: 1 };
let totals = { cal: 0, pro: 0, carb: 0, fat: 0, fib: 0 };
let currentFood = null;

// DOM Elements
const searchInput = document.getElementById('food-search');
const suggestionsBox = document.getElementById('suggestions-box');
const unitSelect = document.getElementById('unit-select');
const quantityInput = document.getElementById('quantity');
const foodList = document.getElementById('food-list');

// 1. Load the Database (foods.json)
fetch('foods.json')
    .then(response => {
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        return response.json();
    })
    .then(data => {
        foodDB = data;
        console.log("Database loaded: " + foodDB.length + " items");
    })
    .catch(error => {
        console.error('Error loading food data:', error);
        alert("Could not load food database. Make sure foods.json is uploaded!");
    });

// 2. Search Logic
searchInput.addEventListener('input', function() {
    const query = this.value.toLowerCase().trim();
    suggestionsBox.innerHTML = '';
    
    if (query.length < 2) {
        suggestionsBox.style.display = 'none';
        return;
    }

    // Filter DB: Find matches (limit to 10 for performance)
    const matches = foodDB.filter(food => 
        food.name.toLowerCase().includes(query)
    ).slice(0, 10);

    if (matches.length > 0) {
        matches.forEach(food => {
            const div = document.createElement('div');
            div.className = 'suggestion-item';
            div.innerHTML = `
                <span>${food.name}</span> 
                <small style="color:#aaa">${food.cal} kcal</small>
            `;
            div.onclick = () => selectFood(food);
            suggestionsBox.appendChild(div);
        });
        suggestionsBox.style.display = 'block';
    } else {
        suggestionsBox.style.display = 'none';
    }
});

// Hide suggestions when clicking outside
document.addEventListener('click', function(e) {
    if (e.target !== searchInput) {
        suggestionsBox.style.display = 'none';
    }
});

// 3. Select Food & Populate Units
function selectFood(food) {
    currentFood = food;
    searchInput.value = food.name;
    suggestionsBox.style.display = 'none';
    
    // Update Units
    unitSelect.innerHTML = "";
    const allUnits = { ...standardUnits, ...currentFood.weights };
    
    for (let unit in allUnits) {
        let opt = document.createElement('option');
        opt.value = allUnits[unit]; 
        opt.text = unit.charAt(0).toUpperCase() + unit.slice(1);
        unitSelect.add(opt);
    }
}

// 4. Add Food to List
function addFood() {
    if (!currentFood) {
        alert("Please search and select a food first.");
        return;
    }
    
    const qty = parseFloat(quantityInput.value);
    const unitWeight = parseFloat(unitSelect.value); // Grams of selected unit
    const unitName = unitSelect.options[unitSelect.selectedIndex].text;

    if (qty <= 0 || isNaN(qty)) {
        alert("Please enter a valid quantity");
        return;
    }

    // Math: (Nutrient per 100g) * (Actual Grams / 100)
    const actualGrams = unitWeight * qty;
    const ratio = actualGrams / 100;

    const addedCal = Math.round(currentFood.cal * ratio);
    const addedPro = (currentFood.pro * ratio);
    const addedCarb = (currentFood.carb * ratio);
    const addedFat = (currentFood.fat * ratio);
    const addedFib = (currentFood.fib * ratio);

    // Update Totals Object
    totals.cal += addedCal;
    totals.pro += addedPro;
    totals.carb += addedCarb;
    totals.fat += addedFat;
    totals.fib += addedFib;

    updateUI();
    addToList(currentFood.name, unitName, qty, addedCal);
    
    // Reset inputs for next item
    searchInput.value = '';
    currentFood = null;
    unitSelect.innerHTML = '';
}

// 5. Update UI
function updateUI() {
    // Update Top Dashboard
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
    updateUI();
    quantityInput.value = 1;
    searchInput.value = "";
    unitSelect.innerHTML = "";
    currentFood = null;
}
