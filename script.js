body {
    font-family: 'Segoe UI', sans-serif;
    background-color: #eef2f5;
    display: flex;
    justify-content: center;
    padding: 15px;
    margin: 0;
}

.container {
    background: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    width: 100%;
    max-width: 420px;
}

h1 {
    text-align: center;
    color: #2c3e50;
    font-size: 1.4rem;
    margin-bottom: 20px;
}

.calculator-box {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.input-group {
    margin-bottom: 12px;
}

.row-inputs {
    display: flex;
    gap: 10px;
}

.half-width {
    width: 50%;
}

label {
    display: block;
    margin-bottom: 4px;
    font-size: 0.85rem;
    font-weight: 600;
    color: #555;
}

select, input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    background: white;
    box-sizing: border-box;
}

button {
    width: 100%;
    padding: 12px;
    background-color: #FF5722; /* Orange for food */
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    font-size: 1rem;
    margin-top: 10px;
}

/* Dashboard for Totals */
.totals-dashboard {
    display: grid;
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
    gap: 8px;
    margin-bottom: 20px;
}

.stat-card {
    background: #f0f4f8;
    padding: 10px;
    border-radius: 6px;
    text-align: center;
}

.stat-card.cal {
    grid-column: span 2; /* Calories takes full width */
    background: #e0f2f1;
    color: #00695c;
    border: 1px solid #b2dfdb;
}

.stat-card .label {
    display: block;
    font-size: 0.75rem;
    color: #666;
    text-transform: uppercase;
}

.stat-card .value {
    display: block;
    font-size: 1.1rem;
    font-weight: bold;
    color: #333;
}

/* List Items */
#food-list {
    list-style: none;
    padding: 0;
}

#food-list li {
    background: white;
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    font-size: 0.9rem;
    display: flex;
    justify-content: space-between;
}

#food-list li div {
    display: flex;
    flex-direction: column;
}

.sub-text {
    font-size: 0.75rem;
    color: #888;
}

.reset-btn {
    background-color: #90a4ae;
        }
