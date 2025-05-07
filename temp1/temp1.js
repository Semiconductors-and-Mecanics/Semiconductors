// --- DOM Elements ---
const semiconductorElement = document.getElementById('semiconductor');
const lightbulbElement = document.getElementById('lightbulb');
// Removed rotationDisplay
const currentStatusDisplay = document.getElementById('currentStatus');

// New input and display elements
const voltageSlider = document.getElementById('voltageSlider');
const voltageDisplay = document.getElementById('voltageDisplay');
const temperatureSlider = document.getElementById('temperatureSlider');
const temperatureDisplay = document.getElementById('temperatureDisplay');


// --- Circuit Data (Graph-like Structure) ---

// Components (Nodes)
const components = {
    battery1: {
        id: 'battery', // Corresponds to HTML ID
        type: 'battery',
        // New: Add voltage state
        voltage: parseFloat(voltageSlider.value) // Initial value from slider
    },
    semi1: {
        id: 'semiconductor', // Corresponds to HTML ID
        type: 'semiconductor',
        element: semiconductorElement,
        // Removed rotation property
    },
    bulb1: {
        id: 'lightbulb', // Corresponds to HTML ID
        type: 'lightbulb',
        element: lightbulbElement,
        isOn: false, // Tracks if the lightbulb should be on
    }
};

// Global state for ambient temperature
let ambientTemperature = parseFloat(temperatureSlider.value); // Initial value from slider


// --- Simulation Parameters (Adjust these for different semiconductor behavior) ---
// These values simulate a basic diode-like behavior:
// Current flows significantly only when voltage is above the threshold AND temperature is above the minimum.
const SEMICONDUCTOR_VOLTAGE_THRESHOLD = 0.7; // Voltage in Volts needed across the semiconductor to conduct
const MINIMUM_CONDUCTION_TEMPERATURE = 0; // Temperature in Celsius below which conduction is minimal (a simplification)


// --- Circuit Logic ---

function updateCircuit() {
    // 1. Determine if current can flow through the entire circuit.
    // In this simple series circuit with a semiconductor (like a diode),
    // current flows if the battery voltage is high enough AND the temperature is suitable.
    // This is a simplified model.
    const voltageIsSufficient = components.battery1.voltage > SEMICONDUCTOR_VOLTAGE_THRESHOLD;
    const temperatureIsSuitable = ambientTemperature > MINIMUM_CONDUCTION_TEMPERATURE;

    const overallCurrentFlowing = voltageIsSufficient && temperatureIsSuitable;

    // 2. Update Semiconductor's visual (no rotation, but could add other visual cues)
    // No transform update needed anymore

    // 3. Update Lightbulb state
    components.bulb1.isOn = overallCurrentFlowing;
    components.bulb1.element.classList.toggle('on', components.bulb1.isOn);

    // 4. Update Wire states (color)
    connections.forEach(conn => {
        // In this simple series circuit, if overall current is flowing, all connections are active.
        conn.currentFlowing = overallCurrentFlowing;
        conn.wires.forEach(wireId => {
            const wireElement = document.getElementById(wireId);
            if (wireElement) {
                wireElement.classList.toggle('wire-active', conn.currentFlowing);
            }
        });
    });

    // 5. Update Status Display
    if (overallCurrentFlowing) {
        currentStatusDisplay.textContent = 'Circulă';
        currentStatusDisplay.style.color = 'green';
    } else {
        currentStatusDisplay.textContent = 'Blocat';
        currentStatusDisplay.style.color = 'red';
    }

    // 6. Update Control Displays
    voltageDisplay.textContent = `${components.battery1.voltage.toFixed(1)} V`; // Display with one decimal place
    temperatureDisplay.textContent = `${ambientTemperature} °C`;
}

// --- Connections (Edges) ---
// This structure remains the same as it defines the circuit path
const connections = [
    {
        id: 'conn1', // Battery to Semiconductor
        from: 'battery1', // ID from 'components' object
        to: 'semi1',      // ID from 'components' object
        wires: ['wire1a', 'wire1b'], // HTML IDs of wire segments
        currentFlowing: false
    },
    {
        id: 'conn2', // Semiconductor to Lightbulb
        from: 'semi1',
        to: 'bulb1',
        wires: ['wire2a', 'wire2b'],
        currentFlowing: false
    },
    {
        id: 'conn3', // Lightbulb back to Battery (completing the circuit)
        from: 'bulb1',
        to: 'battery1', // Logically connects to the negative terminal of the battery
        wires: ['wire3a', 'wire3b','wire3c'],
        currentFlowing: false
    }
];


// --- Event Listeners ---

// Listen for changes on the voltage slider
voltageSlider.addEventListener('input', () => {
    components.battery1.voltage = parseFloat(voltageSlider.value); // Update voltage state
    updateCircuit(); // Re-evaluate and update the entire circuit
});

// Listen for changes on the temperature slider
temperatureSlider.addEventListener('input', () => {
    ambientTemperature = parseFloat(temperatureSlider.value); // Update temperature state
    updateCircuit(); // Re-evaluate and update the entire circuit
});


// --- Initial Setup ---
// Call updateCircuit once on page load to set the initial state
updateCircuit();