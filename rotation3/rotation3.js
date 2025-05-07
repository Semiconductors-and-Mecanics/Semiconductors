// --- DOM Elements ---
const semiconductorAElement = document.getElementById('semiconductorA');
const semiconductorBElement = document.getElementById('semiconductorB');
const lightbulbElement = document.getElementById('lightbulb');
const rotationDisplayA = document.getElementById('rotationDisplayA');
const rotationDisplayB = document.getElementById('rotationDisplayB');
const currentStatusDisplay = document.getElementById('currentStatus');

// --- Circuit Data (Graph-like Structure) ---

// Components (Nodes)
const components = {
    battery1: {
        id: 'battery',
        type: 'battery',
    },
    semiA: {
        id: 'semiconductorA', // Corresponds to HTML ID
        type: 'semiconductor',
        element: semiconductorAElement,
        rotation: 0, // 0 degrees = allowing current, 180 degrees = blocking
    },
    semiB: {
        id: 'semiconductorB', // Corresponds to HTML ID
        type: 'semiconductor',
        element: semiconductorBElement,
        rotation: 0, // 0 degrees = allowing current, 180 degrees = blocking
    },
    bulb1: {
        id: 'lightbulb', // Corresponds to HTML ID
        type: 'lightbulb',
        element: lightbulbElement,
        isOn: false, // Tracks if the lightbulb should be on
    }
};

// Connections (Edges)
// List of wire HTML IDs for updating their appearance.
const connections = [
    'wire1', 'wire2', 'wire3', 'wire4', 'wire5',
    'wire6', 'wire7', 'wire8', 'wire9', 'wire10'
];


// --- Circuit Logic ---

function updateCircuit() {
    // 1. Determine if each semiconductor allows current
    const semiAAllowsCurrent = components.semiA.rotation === 180;
    const semiBAllowsCurrent = components.semiB.rotation === 0;

    // 2. Implement AND gate logic: Current flows to the lightbulb ONLY if BOTH semiconductors allow current.
    const overallCurrentFlowing = semiAAllowsCurrent && semiBAllowsCurrent;

    // 3. Update Semiconductor's visual rotation and display
    components.semiA.element.style.transform = `rotate(${components.semiA.rotation}deg)`;
    rotationDisplayA.textContent = `${components.semiA.rotation}°`;

    components.semiB.element.style.transform = `rotate(${components.semiB.rotation}deg)`;
    rotationDisplayB.textContent = `${components.semiB.rotation}°`;

    // 4. Update Lightbulb state
    components.bulb1.isOn = overallCurrentFlowing;
    components.bulb1.element.classList.toggle('on', components.bulb1.isOn);

    // 5. Update Wire states (color)
    // Make all listed wires active if overall current is flowing.
    connections.forEach(wireId => {
        const wireElement = document.getElementById(wireId);
        if (wireElement) {
            wireElement.classList.toggle('wire-active', overallCurrentFlowing);
            // The background-color transition is handled by the CSS class
        }
    });

    // 6. Update Status Display
    if (components.bulb1.isOn) {
        currentStatusDisplay.textContent = 'Circulă';
        currentStatusDisplay.style.color = 'green';
    } else {
        currentStatusDisplay.textContent = 'Blocat';
        currentStatusDisplay.style.color = 'red';
    }
}

// --- Event Listeners ---

// Handle click on Semiconductor A
components.semiA.element.addEventListener('click', () => {
    // Toggle rotation state (0 to 180, or 180 to 0)
    components.semiA.rotation = (components.semiA.rotation === 0) ? 180 : 0;
    updateCircuit(); // Re-evaluate and update the entire circuit
});

// Handle click on Semiconductor B
components.semiB.element.addEventListener('click', () => {
    // Toggle rotation state (0 to 180, or 180 to 0)
    components.semiB.rotation = (components.semiB.rotation === 0) ? 180 : 0;
    updateCircuit(); // Re-evaluate and update the entire circuit
});


// --- Initial Setup ---
// Call updateCircuit once on page load to set the initial state
updateCircuit();