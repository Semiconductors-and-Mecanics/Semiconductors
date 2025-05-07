// --- DOM Elements ---
const semiconductorElement = document.getElementById('semiconductor');
const lightbulbElement = document.getElementById('lightbulb');
const rotationDisplay = document.getElementById('rotationDisplay');
const currentStatusDisplay = document.getElementById('currentStatus');

// --- Circuit Data (Graph-like Structure) ---

// Components (Nodes)
// We store a reference to the HTML element for easier manipulation if needed,
// and state variables like rotation for semiconductors.
const components = {
    battery1: {
        id: 'battery', // Corresponds to HTML ID
        type: 'battery',
        // Batteries don't have a dynamic state in this simulation other than being a power source.
    },
    semi1: {
        id: 'semiconductor', // Corresponds to HTML ID
        type: 'semiconductor',
        element: semiconductorElement,
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
// Each object represents a logical connection between two components.
// 'wires' is an array of HTML IDs for the div elements that visually form this connection.
const connections = [
    {
        id: 'conn1', // Battery to Semiconductor
        from: 'battery1', // ID from 'components' object
        to: 'semi1',      // ID from 'components' object
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

// --- Circuit Logic ---

function updateCircuit() {
    // 1. Determine if current can flow through the entire circuit.
    // For this simple series circuit, it depends only on the semiconductor's state.
    const semiconductorAllowsCurrent = components.semi1.rotation === 180;
    const overallCurrentFlowing = semiconductorAllowsCurrent; // In a more complex circuit, this would involve checking the whole path.

    // 2. Update Semiconductor's visual rotation
    components.semi1.element.style.transform = `rotate(${components.semi1.rotation}deg)`;
    rotationDisplay.textContent = `${components.semi1.rotation}°`;

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
}

// --- Event Listeners ---

// Handle click on the semiconductor
components.semi1.element.addEventListener('click', () => {
    // Toggle rotation state of the semiconductor
    components.semi1.rotation = (components.semi1.rotation === 0) ? 180 : 0;
    updateCircuit(); // Re-evaluate and update the entire circuit
});

// --- Initial Setup ---
// Call updateCircuit once on page load to set the initial state
updateCircuit();