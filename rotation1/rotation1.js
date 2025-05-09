// --- DOM Elements ---
const semiconductorElement = document.getElementById('semiconductor');
const lightbulbElement = document.getElementById('lightbulb');
const rotationDisplay = document.getElementById('rotationDisplay');
const currentStatusDisplay = document.getElementById('currentStatus');
const toggleJunctionViewButton = document.getElementById('toggleJunctionViewButton');
const semiconductorJunctionFlowElement = document.getElementById('semiconductorJunctionFlow');
const semiconductorJunctionStopElement = document.getElementById('semiconductorJunctionStop');
const junctionViewStatusDisplay = document.getElementById('junctionViewStatus');

// --- Circuit Data (Graph-like Structure) ---
const components = {
    battery1: {
        id: 'battery',
        type: 'battery',
    },
    semi1: {
        id: 'semiconductor',
        type: 'semiconductor',
        element: semiconductorElement,
        rotation: 0, // 0 degrees = original state (let's say allows current if not reversed biased by default)
                     // 180 degrees = rotated state (blocks current if it's a diode)
        isJunctionViewVisible: false, // Tracks if the junction detail is shown
    },
    bulb1: {
        id: 'lightbulb',
        type: 'lightbulb',
        element: lightbulbElement,
        isOn: false,
    }
};

// Connections (Edges)
const connections = [
    { id: 'conn1', from: 'battery1', to: 'semi1', wires: ['wire1a', 'wire1b'], currentFlowing: false },
    { id: 'conn2', from: 'semi1', to: 'bulb1', wires: ['wire2a', 'wire2b'], currentFlowing: false },
    { id: 'conn3', from: 'bulb1', to: 'battery1', wires: ['wire3a', 'wire3b', 'wire3c'], currentFlowing: false }
];

// --- Circuit Logic ---

function updateCircuit() {
    // 1. Determine if current can flow through the semiconductor.
    // For a simple diode simulation:
    // Rotation 0: Current flows (forward biased - assuming battery is connected correctly for this)
    // Rotation 180: Current blocked (reverse biased)
    // The provided code implies current flows at 180 and is blocked at 0. Let's stick to that for consistency with original logic.
    const semiconductorAllowsCurrent = components.semi1.rotation === 180; // Current flows when rotated to 180 deg
    const overallCurrentFlowing = semiconductorAllowsCurrent;

    // 2. Update Semiconductor's visual rotation
    components.semi1.element.style.transform = `rotate(${components.semi1.rotation}deg)`;
    rotationDisplay.textContent = `${components.semi1.rotation}°`;

    // 3. Update Lightbulb state
    components.bulb1.isOn = overallCurrentFlowing;
    components.bulb1.element.classList.toggle('on', components.bulb1.isOn);

    // 4. Update Wire states (color)
    connections.forEach(conn => {
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

    // 6. Update Semiconductor Junction View
    updateJunctionView(overallCurrentFlowing);
}

function updateJunctionView(isCurrentFlowing) {
    if (components.semi1.isJunctionViewVisible) {
        junctionViewStatusDisplay.textContent = 'Afișată';
        if (isCurrentFlowing) {
            semiconductorJunctionFlowElement.classList.add('junction-visible');
            semiconductorJunctionStopElement.classList.remove('junction-visible');
        } else {
            semiconductorJunctionFlowElement.classList.remove('junction-visible');
            semiconductorJunctionStopElement.classList.add('junction-visible');
        }
        // Also, rotate the junction view if the semiconductor itself is rotated
        
        const rotation = components.semi1.rotation;
        semiconductorJunctionFlowElement.style.transform = `rotate(${rotation}deg)`;
        semiconductorJunctionStopElement.style.transform = `rotate(${rotation}deg)`;

    } else {
        junctionViewStatusDisplay.textContent = 'Ascunsă';
        semiconductorJunctionFlowElement.classList.remove('junction-visible');
        semiconductorJunctionStopElement.classList.remove('junction-visible');
        const rotation = components.semi1.rotation;
        semiconductorJunctionFlowElement.style.transform = `rotate(${rotation}deg)`;
        semiconductorJunctionStopElement.style.transform = `rotate(${rotation}deg)`;
    }
}


// --- Event Listeners ---

// Handle click on the semiconductor to rotate it
components.semi1.element.addEventListener('click', () => {
    components.semi1.rotation = (components.semi1.rotation === 0) ? 180 : 0;
    updateCircuit();
});

// Handle click on the "Toggle Junction View" button
toggleJunctionViewButton.addEventListener('click', () => {
    components.semi1.isJunctionViewVisible = !components.semi1.isJunctionViewVisible;
    // We need to know the current flow state to show the correct junction view
    const semiconductorAllowsCurrent = components.semi1.rotation === 180;
    updateJunctionView(semiconductorAllowsCurrent); // Update the junction view based on new visibility and current flow
});

// --- Initial Setup ---
updateCircuit(); // Call updateCircuit once on page load