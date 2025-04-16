// --- Get DOM Elements ---
const capitalInput = document.getElementById('capitalInput');
const stopLossInput = document.getElementById('stopLossInput');
const leverageInput = document.getElementById('leverageInput');
const calculateButton = document.getElementById('calculateButton');
const statusMsg = document.getElementById('statusMessage');

// Get result cells by ID
const resultCells = {
    risk05: document.getElementById('risk05'), risk1: document.getElementById('risk1'), risk2: document.getElementById('risk2'), risk3: document.getElementById('risk3'),
    posSize05: document.getElementById('posSize05'), posSize1: document.getElementById('posSize1'), posSize2: document.getElementById('posSize2'), posSize3: document.getElementById('posSize3'),
    levPosSize05: document.getElementById('levPosSize05'), levPosSize1: document.getElementById('levPosSize1'), levPosSize2: document.getElementById('levPosSize2'), levPosSize3: document.getElementById('levPosSize3'),
};

// --- Helper Function to Format Currency ---
function formatCurrency(value) {
    // Use Intl.NumberFormat for robust, locale-aware currency formatting
    if (isNaN(value) || !isFinite(value) || value === 0) {
        return "-"; // Return '-' for invalid numbers or zero
    }
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    // Remove currency symbol if you just want the number with commas and decimals
    // return formatter.format(value).replace('$', '');
    return formatter.format(value);
}


// --- Helper Function to Clear Results ---
function clearResults() {
    statusMsg.textContent = "";
    statusMsg.className = 'status-message'; // Reset status class
    for (const key in resultCells) {
        if (resultCells.hasOwnProperty(key)) {
            resultCells[key].textContent = "-";
        }
    }
}

// --- Main Calculation Function ---
function calculateAndDisplay() {
    clearResults();

    // --- Get and Validate Inputs ---
    const capital = parseFloat(capitalInput.value);
    const stopLossPercent = parseFloat(stopLossInput.value);
    const leverage = parseFloat(leverageInput.value);

    // Check if any input is not a number
    if (isNaN(capital) || isNaN(stopLossPercent) || isNaN(leverage)) {
        statusMsg.textContent = "Error: Please enter valid numbers in all fields.";
        statusMsg.classList.add('status-error');
        return;
    }

    // Check for non-positive values
    if (capital <= 0 || stopLossPercent <= 0 || leverage <= 0) {
        statusMsg.textContent = "Error: Capital, Stop Loss %, and Leverage must be positive.";
        statusMsg.classList.add('status-error');
        return;
    }

    // --- Perform Calculations ---
    const stopLossDecimal = stopLossPercent / 100.0;
    const riskPercents = [0.005, 0.01, 0.02, 0.03]; // 0.5%, 1%, 2%, 3%
    const ids = ['05', '1', '2', '3']; // To access result cell IDs dynamically

    for (let i = 0; i < riskPercents.length; i++) {
        const riskAmount = capital * riskPercents[i];
        let positionSize = 0;
        let leveragedPositionSize = 0;

        // Calculate Position Size (only if stop loss is valid)
        if (stopLossDecimal > 0) { // Already validated > 0 above, but good practice
            positionSize = riskAmount / stopLossDecimal;
        }

        // Calculate Leveraged Position Size (only if leverage and pos size are valid)
        if (leverage > 0 && positionSize > 0) { // Check positionSize as well
            leveragedPositionSize = positionSize / leverage;
        }

        // --- Display Results ---
        resultCells[`risk${ids[i]}`].textContent = formatCurrency(riskAmount);
        resultCells[`posSize${ids[i]}`].textContent = formatCurrency(positionSize);
        resultCells[`levPosSize${ids[i]}`].textContent = formatCurrency(leveragedPositionSize);
    }

    // --- Show Success Message ---
    statusMsg.textContent = "Calculation complete.";
    statusMsg.classList.add('status-success');
}

// --- Attach Event Listener ---
calculateButton.addEventListener('click', calculateAndDisplay);

// --- Optional: Clear results on page load ---
// window.addEventListener('load', clearResults);
