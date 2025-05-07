// --- DOM Elements ---
const semiconductor1Element = document.getElementById('semiconductor1');
const semiconductor2Element = document.getElementById('semiconductor2');
const lightbulbElement = document.getElementById('lightbulb');
const rotationDisplay1 = document.getElementById('rotationDisplay1');
const rotationDisplay2 = document.getElementById('rotationDisplay2');
const currentStatusDisplay = document.getElementById('currentStatus');

// --- Circuit Data (Graph-like Structure) ---

const components = {
    battery1: {
        id: 'battery',
        type: 'battery',
    },
    semi1: {
        id: 'semiconductor1',
        type: 'semiconductor',
        element: semiconductor1Element,
        rotation: 0, // 0 degrees = allowing current, 180 degrees = blocking
    },
    semi2: {
        id: 'semiconductor2',
        type: 'semiconductor',
        element: semiconductor2Element,
        rotation: 0, // Initial state for the second semiconductor
    },
    bulb1: {
        id: 'lightbulb',
        type: 'lightbulb',
        element: lightbulbElement,
        isOn: false,
    }
};

const connections = [
    {
        id: 'conn_bat_s1', // Battery to Semiconductor 1
        from: 'battery1',
        to: 'semi1',
        wires: ['wire1a', 'wire1b'],
        currentFlowing: false
    },
    {
        id: 'conn_s1_s2', // Semiconductor 1 to Semiconductor 2
        from: 'semi1',
        to: 'semi2',
        wires: ['wire_s1_s2'],
        currentFlowing: false
    },
    {
        id: 'conn_s2_bulb', // Semiconductor 2 to Lightbulb
        from: 'semi2',
        to: 'bulb1',
        wires: ['wire2a_new', 'wire2b_new'],
        currentFlowing: false
    },
    {
        id: 'conn_bulb_bat', // Lightbulb back to Battery
        from: 'bulb1',
        to: 'battery1',
        wires: ['wire3a_new', 'wire3b_new', 'wire3c_new'],
        currentFlowing: false
    }
];

// --- Circuit Logic ---

function updateCircuit() {
    // 1. Determine if current can flow through the entire circuit.
    // Current flows only if BOTH semiconductors allow it.
    const semi1AllowsCurrent = components.semi1.rotation === 0;
    const semi2AllowsCurrent = components.semi2.rotation === 0;
    const overallCurrentFlowing = semi1AllowsCurrent && semi2AllowsCurrent;

    // 2. Update Semiconductors' visual rotation and displays
    components.semi1.element.style.transform = `rotate(${components.semi1.rotation}deg)`;
    rotationDisplay1.textContent = `${components.semi1.rotation}°`;

    components.semi2.element.style.transform = `rotate(${components.semi2.rotation}deg)`;
    rotationDisplay2.textContent = `${components.semi2.rotation}°`;

    // 3. Update Lightbulb state
    components.bulb1.isOn = overallCurrentFlowing;
    components.bulb1.element.classList.toggle('on', components.bulb1.isOn);

    // 4. Update Wire states (color)
    connections.forEach(conn => {
        conn.currentFlowing = overallCurrentFlowing; // In a series circuit, all active or all not.
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
}

// --- Event Listeners ---

// Handle click on the first semiconductor
components.semi1.element.addEventListener('click', () => {
    components.semi1.rotation = (components.semi1.rotation === 0) ? 180 : 0;
    updateCircuit();
});

// Handle click on the second semiconductor
components.semi2.element.addEventListener('click', () => {
    components.semi2.rotation = (components.semi2.rotation === 0) ? 180 : 0;
    updateCircuit();
});

// --- Initial Setup ---
updateCircuit();
